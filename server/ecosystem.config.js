module.exports = {
    apps: [{
        name: 'ofm-agency-hub',
        script: './dist/index.js',
        instances: 2,
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        max_memory_restart: '500M',
        restart_delay: 4000,
        autorestart: true,
        max_restarts: 10,
        min_uptime: '10s'
    }]
};
