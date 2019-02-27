module.exports = {
  apps : [{
    name: 'nemv',
    script: './be/bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    // instances: 1,
    // autorestart: true,
    // watch: false,
    max_memory_restart: '1G',
    env: {
        NODE_ENV: 'development',
        PORT: 3000
    },
    env_pr: {
        NODE_ENV: 'production',
        PORT: 80
    }
  }]

  // 토스트에서 root 접속을 막는 바람에 pm2 deploy는 무용지물이 됨
//   deploy : {
//     production : {
//         user : 'root',
//         host: '133.186.153.47',
//         key: '~/.ssh/pubToastKey.pem',
//         ref  : 'origin/master',
//         repo: 'git@github.com:cisitalia/nemv3.git',
//         path : '/var/www/nemv3',
//         'post-deploy' : 'yarn pm2'
//     }
//   }
};
