pipeline {
    agent {
        docker {
            image 'node:current-alpine'
            args '-p 3000:3000 -v /root/.npm:/.npm -v /root/.cache:/.cache'
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
                sh 'npm list'
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
