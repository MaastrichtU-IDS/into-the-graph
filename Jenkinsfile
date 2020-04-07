pipeline {
  agent any
  options {
    skipDefaultCheckout true
  }
  stages {
    stage('checkout') {
      when {
          branch 'master'
      }
      steps {
        git 'https://github.com/MaastrichtU-IDS/into-the-graph.git'
      }
    }
    stage('build') {
      when {
          branch 'master'
      }
      steps {
        sh 'docker build -t umids/into-the-graph:latest .'
      }
    }
    stage('push') {
      when {
          branch 'master'
      }
      steps {
        sh 'docker push umids/into-the-graph:latest'
      }
    }
    stage('remove') {
      when {
          branch 'master'
      }
      steps {
        sh 'docker stop into-the-graph || true'
      }
    }
    stage('deploy') {
      when {
          branch 'master'
      }
      steps {
        sh 'docker run -it -d --rm --name into-the-graph -e VIRTUAL_HOST=trek.semanticscience.org umids/into-the-graph:latest'
      }
    }
  }
}