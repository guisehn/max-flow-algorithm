'use strict'

var fs = require('fs')
  , _ = require('lodash')
  , MaxFlow = require('./max-flow') 

function readFile() {
  var filePath = process.argv[2]

  if (!filePath) {
    throw new Error('Please specify the file path as an argument')
  }

  return fs.readFileSync(filePath, { encoding: 'UTF-8' })
}

function mountTuples(str) {
  var lines = str.trim().split('\n').map(x => x.trim())
  var tuples = lines.map(x => x.split(/\s+/))

  return tuples
}

function mountGraph(tuples) {
  var graph = {}

  tuples.forEach(tuple => {
    var first = parseInt(tuple[0], 10)
      , second = parseInt(tuple[1], 10)
      , value = parseInt(tuple[2], 10)

    assignToGraph(graph, first, second, value, true)
    assignToGraph(graph, second, first, 0, false)
  })

  return graph
}

function assignToGraph(graph, originNode, targetNode, value, overwrite) {
  if (!graph[originNode]) {
    graph[originNode] = []
  }

  var link = _.find(graph[originNode], { node: targetNode })

  if (link) {
    if (overwrite) {
      link.value = value
    }
  } else {
    link = { node: targetNode, value: value }
    graph[originNode].push(link)
  }
}

function getAllNodes(graph) {
  return _.keys(graph).map(x => parseInt(x, 10))
}

function getStartNode(nodes) {
  return _.min(nodes)
}

function getEndNode(nodes) {
  return _.max(nodes)
}

function output(result, endNode) {
  var lines = [], str

  _.forEach(result.graph, (neighbors, node) => {
    _.forEach(neighbors, neighbor => {
      lines.push(node + ' ' + neighbor.node + ' ' + neighbor.value)
    })
  })

  lines.push('', 'Final sum = ' + result.finalSum)

  var str = lines.join('\n')

  console.log(str)
}

function run() {
  var content = readFile()
  var tuples = mountTuples(content)
  var graph = mountGraph(tuples)
  var allNodes = getAllNodes(graph)
  var startNode = getStartNode(allNodes)
  var endNode = getEndNode(allNodes)
  var result = MaxFlow.calculate(graph, startNode, endNode)

  output(result)
}

run()