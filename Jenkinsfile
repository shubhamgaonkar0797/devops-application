
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'shubham0797/devops-application'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        K8S_NAMESPACE = 'devops-application'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                sh '''
                    set -e
                    test -f app/Dockerfile
                    test -f app/package.json
                    test -f app/server.js
                    test -f kubernetes/app-deployment.yaml
                    test -f kubernetes/postgres-deployment.yaml
                    test -f kubernetes/postgres-pvc.yaml
                    test -f kubernetes/app-service.yaml
                    echo "All required files verified"
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
                sh 'docker images ${DOCKER_IMAGE}'
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

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    set -e

                    kubectl apply -f kubernetes/postgres-pvc.yaml
                    kubectl apply -f kubernetes/postgres-deployment.yaml
                    kubectl apply -f kubernetes/postgres-service.yaml
                    kubectl apply -f kubernetes/app-deployment.yaml
                    kubectl apply -f kubernetes/app-service.yaml

                    kubectl set image \
                      deployment/devops-application \
                      devops-application=${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                    set -e

                    kubectl rollout status deployment/postgres \
                      -n ${K8S_NAMESPACE} --timeout=180s

                    kubectl rollout status deployment/devops-application \
                      -n ${K8S_NAMESPACE} --timeout=180s

                    kubectl get deployments -n ${K8S_NAMESPACE}
                    kubectl get pods -n ${K8S_NAMESPACE}
                    kubectl get services -n ${K8S_NAMESPACE}
                '''
            }
        }
    }

    post {
        success {
            echo 'DevOps Application successfully deployed to Kubernetes!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output for details.'
        }
    }
}

