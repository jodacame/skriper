module.exports = {
    apps: [{
        name: "server",
        cwd: "./server",
        script: "server.js",
        instances: 1,
        autorestart: true,
        watch: false,
    }]
}