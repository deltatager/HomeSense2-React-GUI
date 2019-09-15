pipeline {
    agent {
        docker {
            image 'node:latest'
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
                sh 'ssh pi@pi1.deltanet.int "rm -rf /var/www/homesense2/*"'
                sh 'scp -r build/* pi@pi1.deltanet.int:/var/www/homesense2/*'
            }
        }
    }
}
