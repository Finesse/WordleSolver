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

const matchingWords = []

const rl = readline.createInterface({
  input: fs.createReadStream('russianNouns5Letters.txt'), // Только существительные в дефолтной форме 5 букв
  crlfDelay: Infinity,
})

lines:
for await (const line of rl) {
  const displayedWord = line.trim()
  const word = displayedWord.toLowerCase().replaceAll('ё', 'е')
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
  matchingWords.push(displayedWord)
}

// https://ru.wikipedia.org/wiki/Частотность
const letterFrequency = {
  'а': 40487008,
  'б': 8051767,
  'в': 22930719,
  'г': 8564640,
  'д': 15052118,
  'е': 42691213 + 184928,
  'ж': 4746916,
  'з': 8329904,
  'и': 37153142,
  'й': 6106262,
  'к': 17653469,
  'л': 22230174,
  'м': 16203060,
  'н': 33838881,
  'о': 55414481,
  'п': 14201572,
  'р': 23916825,
  'с': 27627040,
  'т': 31620970,
  'у': 13245712,
  'ф': 1335747,
  'х': 4904176,
  'ц': 2438807,
  'ч': 7300193,
  'ш': 3678738,
  'щ': 1822476,
  'ъ': 185452,
  'ы': 9595941,
  'ь': 8784613,
  'э': 1610107,
  'ю': 3220715,
  'я': 10139085,
}

function getFrequencyScore(word) {
  let seenLetters = new Set()
  let score = 0
  for (let letter of word) {
    letter = letter.toLowerCase()
    // Повторяющиеся буквы дают меньше очков, чтобы
    score += (letterFrequency[letter] ?? 0) * (seenLetters.has(letter) ? 0.5 : 1)
    seenLetters.add(letter)
  }
  return score
}

matchingWords.sort((word1, word2) => getFrequencyScore(word2) - getFrequencyScore(word1))
console.log('Подходящие слова:', matchingWords)
