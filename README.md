# Svoyak / Свояк

[English](#english) | [Русский](#русский)

---

## English

Interface for a multiplayer quiz game inspired by the popular trivia show.

Live Demo: [https://maks-eco.github.io/svoyak](https://maks-eco.github.io/svoyak)

### Features
* **Multiplayer Support:** Play with friends in real-time.
* **Responsive Interface:** Optimized for both desktop and mobile devices.

### Getting Started

#### Prerequisites
* Docker and Docker Compose installed on your system.

#### Installation & Running

##### Development Mode
To start the development server with hot-reloading:
```bash
docker compose --profile dev up
```

##### Production Build
To build and run the production-ready container:
```bash
docker compose --profile build up
```

---

## Русский

Интерфейс для мультиплеерной викторины по мотивам популярного телешоу «Своя игра».

Демо-версия проекта: [https://maks-eco.github.io/svoyak](https://maks-eco.github.io/svoyak)

### Особенности
* **Мультиплеер:** Возможность играть с друзьями в режиме реального времени.
* **Адаптивный интерфейс:** Удобно играть как с компьютера, так и с мобильных устройств.

### Запуск проекта

#### Требования
* Установленные Docker и Docker Compose.

#### Инструкция по запуску

##### Режим разработки (Development)
Для запуска локального сервера разработки с поддержкой hot-reload:
```bash
docker compose --profile dev up
```

##### Продакшн сборка (Production)
Для сборки и запуска оптимизированного продакшн-контейнера:
```bash
docker compose --profile build up
```
