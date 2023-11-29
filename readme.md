# 5 букв

([translate to English](https://github-com.translate.goog/Finesse/WordleSolver?_x_tr_sl=ru&_x_tr_tl=en&_x_tr_hl=en))

Помогает решать игру «5 букв» от Тинькофф.
Далеко не лучшая реализация, делаю исключительно для себя.

## Как пользоваться

Установите [Node.js](https://nodejs.org/).
Скачайте репозиторий и откройте корневую директорию в терминале.

В первый раз выполните:

```bash
node index.mjs "-----" ""
```

Программа выведет список лучших слов для первой попытки.
Введите какое-нибудь из них в игре.

Затем выполняйте:

```bash
node index.mjs "т----" "кучесина" "о----" "----р"
```

- `т----` — известные буква на верных позициях (жёлтые)
- `кучесина` — буквы, которых нет (серые)
- Любое количество следующих аргументов — буквы, которые есть, но на неверных позициях (белые)