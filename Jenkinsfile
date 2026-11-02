
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'shubham0797/devops-application'
        PROJECT_DIR = '/home/ubuntu/devops-application'
        COMPOSE_FILE = '/home/ubuntu/devops-application/compose.yaml'
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
                echo 'Verifying application files'

                sh '''
                    test -f app/Dockerfile
                    test -f app/package.json
                    test -f app/server.js
                    test -f compose.yaml
                    echo "All required files verified"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'

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

        stage('Deploy Application') {
            steps {
                echo 'Deploying latest application image using Docker Compose'

                sh '''
                    docker compose \
                      --project-directory "$PROJECT_DIR" \
                      -f "$COMPOSE_FILE" \
                      pull app

                    docker compose \
                      --project-directory "$PROJECT_DIR" \
                      -f "$COMPOSE_FILE" \
                      up -d --no-deps app
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking application health'

                sh '''
                    sleep 5

                    curl --fail --silent \
                      http://localhost:8082/health

                    echo "Application deployment verified"
                '''
            }
        }
    }

    post {
        success {
            echo 'DevOps Application CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output for details.'
        }
    }
}

