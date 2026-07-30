

<h1 align="center">Nifty Minter Dapp - Front End</h1>
<p>
  <img alt="Versión" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="Licencia: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/AJanovitch" target="_blank">
    <img alt="Twitter: AJanovitch" src="https://img.shields.io/twitter/follow/AJanovitch.svg?style=social" />
  </a>
</p>

> Crea NFTs únicos a partir de descripciones de texto con generación de imágenes por IA y véndelos en [OpenSea](https://testnets.opensea.io)

## Recursos

- [Sitio desplegado](https://nifty-minter.herokuapp.com)
- [Ver tutorial sobre cómo usar la Dapp](https://www.youtube.com/watch?v=bSk57Y9tEbs)
- [Repositorio del Backend](https://github.com/aaronjan98/Nifty-Minter-Backend)
- [Contrato en Etherscan](https://goerli.etherscan.io/address/0x8d20aac997e30de71581ac30240db9ab235acb8b)

## Ejecutar localmente

### Instalación

- ejecuta este comando para los repositorios de back y front end

  ```sh
  npm install
  ```

- N.B. Se requieren claves API en el `.env` de tu front end

  - [Obtener claves API de Infura](https://app.infura.io)
  - [Clave de Hugging Face](https://huggingface.co/)

  ```.env
  REACT_APP_INFURA_API_KEY=""
  REACT_APP_INFURA_PROJECT_ID=""
  REACT_APP_HUGGING_FACE_KEY=""
  ```

### Uso

1. Ejecuta el nodo de blockchain con ganache en la raíz del back end

```sh
npm run ganache
```

2. Agrega la red a MetaMask e importa las cuentas de ganache

- puedes cambiar el puerto y el chain ID en los scripts de package.json,
  pero por defecto la URL RPC es `http://127.0.0.1:9002`,
  el chain ID es `1338` y el símbolo de la moneda es `ETH`.

3. Despliega el contrato NFT en la blockchain local

- Si los repositorios de front end y back end están uno al lado del otro,
  entonces el ABI del NFT se escribirá automáticamente en el front end.
  De lo contrario, tendrás que cambiar la ruta del archivo en `common/tokens.js`.

  ```sh
  npx hardhat run scripts/deploy.js --network ganache
  ```

4. Luego, necesitarás copiar la dirección del NFT mostrada en el comando anterior
   y actualizar la dirección del NFT en el archivo de front end `src/config.json`

- Opcionalmente, puedes ver los saldos de Ether de las cuentas de ganache/hardhat
  con este comando

  ```sh
  npx hardhat run scripts/getBalances.js --network ganache
  ```

5. inicia el servidor local para el front end

```sh
npm run dev
```

### Ejecutar pruebas

- Prueba los contratos con hardhat

```sh
npx hardhat test
```

## Autor

👤 **aaronjanovitch@gmail.com**

- Sitio web: aaronjanovitch.com
- Twitter: [@AJanovitch](https://twitter.com/AJanovitch)
- Github: [@aaronjan98](https://github.com/aaronjan98)
- LinkedIn: [@aaron-janovitch](https://linkedin.com/in/aaron-janovitch)

## Muestra tu apoyo

¡Dale una ⭐️ si este proyecto te ayudó!
