pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'shubham0797/devops-application'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                sh '''
                    test -f app/Dockerfile
                    test -f app/package.json
                    test -f app/server.js
                    echo "Application files verified"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -t ${DOCKER_IMAGE}:latest \
                      ./app
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x

                        printf '%s' "$DOCKERHUB_TOKEN" | \
                          docker login \
                          --username "$DOCKERHUB_USER" \
                          --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'DevOps Application image successfully pushed to Docker Hub!'
        }

        failure {
            echo 'Pipeline failed. Please check Console Output.'
        }
    }
}
