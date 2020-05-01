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
    stage('deploy') {
      when {
          branch 'master'
      }
      steps {
        parallel(
          push: {
            sh 'docker push umids/into-the-graph:latest'
          },
          deploy: {
            sh 'docker stop into-the-graph || true'
            sh 'docker run -it -d --rm --name into-the-graph --restart unless-stopped -e VIRTUAL_HOST=trek.semanticscience.org umids/into-the-graph:latest'
          }
        )
      }
    }
  }
}
