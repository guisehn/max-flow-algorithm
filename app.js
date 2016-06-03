'use strict'

var fs = require('fs')
  , _ = require('lodash')
  , MaxFlow = require('./max-flow') 

var argv = require('yargs')
  .usage('Calculates the max flow for a graph represented in a file.\nUsage $0 <input_file>')
  .demand(1)
  .number('s')
  .alias('s', 'start')
  .describe('s', 'Start node (if not specified, smaller node will be used)')
  .number('e')
  .alias('e', 'end')
  .describe('e', 'End node (if not specified, larger node will be used)')
  .string('o')
  .alias('o', 'output')
  .describe('o', 'Output file (if not specified, output will be printed)')
  .help('help')
  .argv

function readFile() {
  var filePath = argv._[0]
  return fs.readFileSync(filePath, { encoding: 'utf8' })
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
  return argv.start || argv.s || _.min(nodes)
}

function getEndNode(nodes) {
  return argv.end || argv.e || _.max(nodes)
}

function mountResultString(result, endNode) {
  var lines = []

  _.forEach(result.graph, (neighbors, node) => {
    _.forEach(neighbors, neighbor => {
      lines.push(node + ' ' + neighbor.node + ' ' + neighbor.value)
    })
  })

  lines.push('', 'Final sum = ' + result.finalSum)

  return lines.join('\n')
}

function output(str) {
  var file = argv.output || argv.o

  if (file) {
    fs.writeFileSync(file, str)
    console.log('Output written to ' + file)
  } else {
    console.log(str)
  }
}

function run() {
  var content = readFile()
  var tuples = mountTuples(content)
  var graph = mountGraph(tuples)
  var allNodes = getAllNodes(graph)
  var startNode = getStartNode(allNodes)
  var endNode = getEndNode(allNodes)
  var result = MaxFlow.calculate(graph, startNode, endNode)
  var resultString = mountResultString(result)

  output(resultString)
}

run()