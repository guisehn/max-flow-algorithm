'use strict'

var _ = require('lodash')

function getCandidates(graph, node, path) {
  return graph[node]
    .filter(link => !_.includes(path, link.node))
    .filter(link => link.node !== node)
    .filter(link => link.value > 0)
}

function getMinimumValueFromPath(graph, path) {
  var values = path.slice(0, -1).map((current, i) => {
    var next = path[i + 1]
    return _.find(graph[current], { node: next }).value
  })

  return _.min(values)
}

function adjustValues(graph, path) {
  var minValue = getMinimumValueFromPath(graph, path)

  path.slice(0, -1).forEach((current, i) => {
    var next = path[i + 1]

    var link1 = _.find(graph[current], { node: next })
    link1.value -= minValue

    var link2 = _.find(graph[next], { node: current })
    link2.value += minValue
  })
}

function walk(graph, node, endNode, path) {
  var candidates = getCandidates(graph, node, path)

  path.push(node)

  if (node === endNode) {
    adjustValues(graph, path)
    return true
  }

  do {
    if (candidates.length === 0) {
      return false
    }

    var next = _.maxBy(candidates, x => x.value)
    _.remove(candidates, { node: next.node })
  }
  while (!walk(graph, next.node, endNode, _.clone(path)))

  return true
}

function calculateFinalSum(graph, endNode) {
  return _.sumBy(graph[endNode], 'value')
}

function calculate(graph, startNode, endNode) {
  graph = _.cloneDeep(graph)

  while (walk(graph, startNode, endNode, []));

  var finalSum = calculateFinalSum(graph, endNode)

  return {
    graph: graph,
    finalSum: finalSum
  }
}

module.exports = {
  calculate: calculate
}