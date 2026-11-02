pipeline {
    agent any

    environment {
        APP_NAME = 'devops-application'
        DOCKER_IMAGE = 'devops-application'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Getting DevOps Application source code from GitHub'
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                echo 'Checking application files'

                sh '''
                    ls -la
                    ls -la app
                    test -f app/Dockerfile
                    test -f app/package.json
                    test -f app/server.js
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'

                sh '''
                    docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ./app
                '''
            }
        }

        stage('Verify Docker Image') {
            steps {
                sh '''
                    docker images ${DOCKER_IMAGE}
                '''
            }
        }
    }

    post {
        success {
            echo 'DevOps Application pipeline completed successfully!'
        }

        failure {
            echo 'DevOps Application pipeline failed. Check the console output.'
        }
    }
}
