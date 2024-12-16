import openai from 'openai';
import Logger from './logger.js';
import fs from 'fs';
const OpenAI = {
    client: null,
    init(api_key) {
        if (!api_key || this.client) {
            return;
        }
        Logger.info("Initializing OpenAI client");
        this.client = new openai({
            apiKey: api_key,
        });
    },
    models: {
        async list() {
            if (!OpenAI.client) {
                return [];
            }
            const models = await OpenAI.client.models.list();
            return models.data;
        }
    },
    assistant: {
        file: {
            list: async ({ assistant_id } = {}) => {
                const assistant = await OpenAI.client.beta.assistants.retrieve(assistant_id);
                const vector_store_id = assistant.tool_resources.file_search?.vector_store_ids[0];
                const files = [];
                if (!vector_store_id) {
                    return files;
                }

                const vectorStore = await OpenAI.client.beta.vectorStores.files.list(vector_store_id, {
                    limit: 100,
                });

                for (const file of vectorStore.data) {
                    const fileObject = await OpenAI.client.files.retrieve(file.id);

                    files.push({
                        vector_id: vector_store_id,
                        file_id: fileObject.id,
                        name: fileObject.filename,
                        created_at: fileObject.created_at,
                        size: fileObject.bytes,
                        status: fileObject.status,
                    });
                }

                // files.push({
                //     id: vectorStore.id,
                //     name: vectorStore.name,
                //     created_at: vectorStore.created_at,
                //     size: vectorStore.usage_bytes,
                //     status: vectorStore.status,
                // });

                return files;
            },
            /**
             * Uploads a file to OpenAI and attact it to assistant as vector
             * @param {object} data
             * @param {string} data.content - Base64 encoded file
             *  
             */
            async upload({ assistant_id, content, name } = {}) {
                if (!OpenAI.client) {
                    return null;
                }
                content = content.replace(/^data:.*?;base64,/, '');
                // write tmp file
                const tmpName = `/tmp/${name}`;
                fs.writeFileSync(tmpName, Buffer.from(content, 'base64'));
                Logger.debug(`Uploading file to OpenAI`, { assistant_id, name, content: content.slice(0, 100) });

                const file = await OpenAI.client.files.create({
                    file: fs.createReadStream(tmpName),
                    purpose: 'assistants',
                });
                fs.unlinkSync(tmpName);
                Logger.debug(`Uploaded file ${file.id}`);
                let vectorStore = null
                const currentAssistant = await OpenAI.client.beta.assistants.retrieve(assistant_id);
                if (currentAssistant.tool_resources.file_search) {
                    const vectorStoreIds = currentAssistant.tool_resources.file_search.vector_store_ids;
                    if (vectorStoreIds.length > 0) {
                        Logger.debug(`Vector store found ${vectorStoreIds[0]}`);
                        vectorStore = await OpenAI.client.beta.vectorStores.retrieve(vectorStoreIds[0]);
                    }
                }
                if (!vectorStore) {

                    vectorStore = await OpenAI.client.beta.vectorStores.create({
                        name: currentAssistant.name,
                    });
                }



                Logger.debug(`Vector store created ${vectorStore.id}`);

                await OpenAI.client.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
                    file_ids: [file.id],
                });
                const vector_store_ids = [vectorStore.id];
                // Update assistant with vector store
                Logger.debug(`Updating assistant with vector store ${vectorStore.id}`);
                await OpenAI.client.beta.assistants.update(assistant_id, {
                    tool_resources: {
                        file_search: { vector_store_ids }
                    },
                    tools: [{
                        type: "file_search",
                    },],
                });
                return file;
            },
            async delete({ file_id } = {}) {
                await OpenAI.client.files.del(file_id);
            }
        },
        async delete({ assistant_id } = {}) {
            const assistant = await OpenAI.client.beta.assistants.retrieve(assistant_id);
            await OpenAI.client.beta.assistants.del(assistant_id);
            // Delete all vectors and files
            if (assistant.tool_resources.file_search) {
                const vectorStoreIds = assistant.tool_resources.file_search.vector_store_ids;
                for (const vectorStoreId of vectorStoreIds) {
                    const vectorStore = await OpenAI.client.beta.vectorStores.retrieve(vectorStoreId);
                    const files = await OpenAI.client.beta.vectorStores.files.list(vectorStoreId, {
                        limit: 100,
                    });
                    for (const file of files.data) {
                        await OpenAI.client.files.del(file.id);
                    }
                    await OpenAI.client.beta.vectorStores.del(vectorStoreId);
                }
            }
            return assistant;
        },
        async update({ assistant_id, name, description, instructions, model = 'gpt-4o' } = {}) {
            const assistant = await OpenAI.client.beta.assistants.update(assistant_id, {
                name,
                description,
                instructions,
                model,
                tool_resources: {},
                tools: [{
                    type: "file_search",
                },],
            });
            return assistant;
        },
        async create({ name, description, instructions, model = 'gpt-4o' } = {}) {
            const assistant = await OpenAI.client.beta.assistants.create({
                name,
                description,
                instructions,
                model,
                tool_resources: {},
                tools: [{
                    type: "file_search",
                },],
            });
            return assistant;
        },
        async get(id) {
            if (!OpenAI.client) {
                return null;
            }
            const assistant = await OpenAI.client.beta.assistants.retrieve(id);
            return assistant;
        }
    },
    thread: {
        async create() {
            const thread = await OpenAI.client.beta.threads.create();
            return thread;
        },
        async delete({ thread_id } = {}) {
            await OpenAI.client.beta.threads.del(thread_id);
        }
    },
    message: {
        async all({ thread_id, limit = 100 } = {}) {
            if (!OpenAI.client) {
                return [];
            }
            const messages = await OpenAI.client.beta.threads.messages.list(thread_id, {
                limit,
            });

            const response = []
            for (const message of messages.data) {
                // return messages.data.map(async (message) => {
                let attachment = message.attachments && message.attachments.length ? message.attachments[0] : null;
                if (attachment) {
                    try {
                        attachment = await OpenAI.client.files.retrieve(attachment.file_id);
                    } catch (error) {
                        attachment = null;

                    }

                }

                response.push({
                    id: message.id,
                    role: message.role,
                    message: message.content && message.content.length ? message.content[0].type == 'text' ? message.content[0].text.value : '' : '', // TODO: Handle other types
                    created_at: message.created_at,
                    attachment,
                });
            }
            return response.reverse();

        },
        async delete({ message_id, thread_id } = {}) {
            Logger.info(`Deleting message ${message_id} from thread ${thread_id}`);
            await OpenAI.client.beta.threads.messages.del(thread_id, message_id);
        },
        async send({ thread_id, assistant_id, text, attachtment = null } = {}) {
            Logger.info(`Sending message to thread ${thread_id}`);
            let attachments = null
            if (attachtment) {
                attachtment.name = attachtment.name.replace(/[^a-zA-Z0-9.]/g, '_');
                attachtment.content = attachtment.content.replace(/^data:.*?;base64,/, '');
                const tmpName = `/tmp/${attachtment.name}`;
                fs.writeFileSync(tmpName, Buffer.from(attachtment.content, 'base64'));
                const file = await OpenAI.client.files.create({
                    file: fs.createReadStream(tmpName),
                    purpose: 'assistants',
                });

                Logger.debug(`Uploaded file ${file.id}`, file);
                attachments = [{
                    file_id: file.id,
                    tools: [{
                        type: "file_search",
                    }]
                }];
                fs.unlinkSync(tmpName);

            }
            const message = await OpenAI.client.beta.threads.messages.create(thread_id, {
                role: "user",
                content: text,
                attachments,
            });
            Logger.info(`Message sent ${message.id}`, message);

            return OpenAI.client.beta.threads.runs.create(
                thread_id,
                { assistant_id: assistant_id, stream: true },
            );

        }
    }
};

export default OpenAI;