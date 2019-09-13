pipeline {
    agent {
        docker {
            image 'node:current-alpine'
            args '-p 3000:3000 -v /usr/local/lib/node_modules:/usr/local/lib/node_modules'
        }
    }
    environment {
        CI = 'true' 
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm -g list'
            }
        }

        stage('Deploy') {
            steps {
                sh 'pwd'
                sh 'whoami'
            }
        }
    }
}
