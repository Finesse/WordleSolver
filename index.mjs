/*

Как пользоваться:

node index.mjs "-----" "кучесина" "о----" "----р"

"-----" — известные буква на верных позициях (жёлтые)
"кучесина" — буквы, которых нет (серые)
Любое количество следующих аргументов — буквы, которые есть, но на неверных позициях (белые)

*/

import * as fs from 'fs'
import * as readline from 'readline'

const expectedLength = 5
const [, , correctMask, knownToMiss, ...wrongPositions] = process.argv
const blanks = new Set([' ', '-', '_', undefined])
const knownToExist = new Set(
  wrongPositions.flatMap(
    positions => positions.split('').filter(
      char => !blanks.has(char)
    )
  )
)

console.log('Известные буквы на верных позициях:', correctMask)
console.log('Буквы, которые есть, но позиции неизвестны:', [...knownToExist].join(''))
console.log('Где нет этих букв:', wrongPositions)
console.log('Буквы, которых нет:', knownToMiss)
console.log('Подходящие слова:')

const rl = readline.createInterface({
  input: fs.createReadStream('russian_filtered.txt'), // Только существительные в дефолтной форме 5 букв
  crlfDelay: Infinity,
})

lines:
for await (const line of rl) {
  const word = line.trim().toLowerCase().replaceAll('ё', 'е')
  if (word.length !== expectedLength) {
    continue
  }
  if (!doesMatchMask(correctMask, word)) {
    continue
  }
  for (const char of knownToExist) {
    if (!word.includes(char)) {
      continue lines
    }
  }
  for (const char of knownToMiss) {
    if (word.includes(char)) {
      continue lines
    }
  }
  for (const positions of wrongPositions) {
    for (let i = 0; i < word.length; ++i) {
      if (!blanks.has(positions[i])) {
        if (word[i] === positions[i]) {
          continue lines
        }
      }
    }
  }
  console.log(word)
}

function doesMatchMask(mask, word) {
  for (let i = 0; i < word.length; ++i) {
    if (!blanks.has(mask[i])) {
      if (word[i] !== mask[i]) {
        return false
      }
    }
  }
  return true
}

// todo: Сортировать слова по частотности букв: https://ru.wikipedia.org/wiki/Частотность
