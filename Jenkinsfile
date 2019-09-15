pipeline {
    agent {
        docker {
            image 'node:current-alpine'
            args '-v node_module:/var/jenkins_home/workspace/HomeSense2-React-GUI_master/node_modules'
        }
    }
    environment {
            CI = 'true'
        }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sh 'ls -l build'
            }
        }
    }
}
