# Seshat (WIP)

You can read some more information about the name [here](https://en.wikipedia.org/wiki/Seshat).

## Install

```bash
$ npm install
```

## Usage

```bash
# Launch Seshat ledger server
$ npm run start -- [args]
```

### Command line arguments

| Argument | Alias | Example | Description |
| --- | --- | --- | --- |
| `--port`   | `-p` | `-p 3001` | Sets the HTTP Server's port |
| `--p2p_port` | `-x` | `-x 5001`  | Sets the P2P Server's port |
| `--peers` | `-s` | `-s ws://localhost:5001,ws://localhost:5002` | Sets the P2P Server's peers (comma-separated) |
| `--database` | `-d` | `-d ./_db/seshat.db` | Sets the path to the database file (.db) |

### HTTP Routes

| Route | Method | Description |
| --- | --- | --- | 
| `/mine`   | `POST` | Adds a new block to the blockchain |
| `/blocks`   | `GET` | Returns all the blocks in the blockchain |
| `/query`   | `GET` | Querries the TableEngine (only SELECT statement allowed) |

---

## License

[MIT](http://opensource.org/licenses/MIT)