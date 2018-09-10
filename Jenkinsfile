#!groovy

pipeline {
    agent any

    environment {
        BUILT_COMPONENT_NAME = 'plutonium-pagination'
        SLACK_CHANNEL = '#jenkins'
        GITHUB_CREDENTIALS_ID = 'credentials-github-lordoftheflies-ssh'
        GITHUB_ACCESS_TOKEN = 'a0247efa6210580b301c963c9dba0f7af8f1b67f'
    }

    stages {
        // pulls down locally the sources for the component
        stage('checkout') {
            steps {
                slackSend channel: "${SLACK_CHANNEL}", message: "Build #${env.BUILD_NUMBER} Started - ${env.JOB_NAME} (<${env.BUILD_URL}|Open build>)"
                git(url: "git@github.com:lordoftheflies/${BUILT_COMPONENT_NAME}.git", branch: 'master', changelog: true, credentialsId: '${GITHUB_CREDENTIALS_ID}', poll: true)
            }
        }

        // Install the bower dependencies of the component
        stage('install dependencies') {
            steps {
                script {
                    sh "bower install"
                }
            }
        }

        // Lints, and tests the component
        stage('test') {
            steps {
                script {
                    // sh "polymer lint"
                    sh "polymer test --local chrome --config-file wct.conf.json"
                    junit allowEmptyResults: true, testResults: 'wct.xml'
                }


            }
        }

        stage('Bump version') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        def bower = readJSON file: 'bower.json'
                        echo "Application version: $bower.version"
                        sh "bumpversion --allow-dirty --message 'Jenkins Build ${BUILD_NUMBER} bump version of portalcrawler: {current_version}: {new_version}' --commit --tag --tag-name 'v{new_version}' --current-version '${bower.version}' patch ./bower.json"
                        sh '''git push origin master'''
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh "polymer build"
                }
            }
        }

        stage('Distribution') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        def bower = readJSON file: 'bower.json'
                        sh "curl --data '{\"tag_name\": \"${bower.version}\",\"target_commitish\": \"master\",\"name\": \"${bower.version}\",\"body\": \"Release of version ${bower.version}\",\"draft\": false,\"prerelease\": false}' https://lordoftheflies:Armageddon4325@api.github.com/repos/lordoftheflies/${BUILT_COMPONENT_NAME}/releases?access_token=${GITHUB_ACCESS_TOKEN}"
                        slackSend color: "warning", channel: "${SLACK_CHANNEL}", message: "Build #${env.BUILD_NUMBER} Distribution of ${bower.version} Completed - ${env.JOB_NAME} (<https://jenkins.cherubits.hu/blue/organizations/jenkins/${BUILT_COMPONENT_NAME}/detail/master/${env.BUILD_NUMBER}/pipeline|Open build>, <https://www.webcomponents.org/element/lordoftheflies/${BUILT_COMPONENT_NAME}|Visit>)"
                    }

                }
            }
        }

    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    post {

        success {
            slackSend color: "good", channel: "${SLACK_CHANNEL}", message: "Build #${env.BUILD_NUMBER} Succeed - ${env.JOB_NAME} (<https://jenkins.cherubits.hu/blue/organizations/jenkins/${BUILT_COMPONENT_NAME}/detail/master/${env.BUILD_NUMBER}/pipeline|Open>)"
        }

        failure {
            slackSend color: "danger", channel: "${SLACK_CHANNEL}", message: "Build #${env.BUILD_NUMBER} Failed - ${env.JOB_NAME} (<https://jenkins.cherubits.hu/blue/organizations/jenkins/${BUILT_COMPONENT_NAME}/detail/master/${env.BUILD_NUMBER}/pipeline|Open>)"
        }
    }
}