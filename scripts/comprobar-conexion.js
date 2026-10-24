const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

async function main() {
  try {
    await conectarBaseDatos();
    console.log("Conexión finalizada correctamente.");
  } finally {
    await desconectarBaseDatos();
  }
}

main().catch((error) => {
  console.error("No se pudo establecer la conexion:", error.message);
  console.error("Revisar MONGODB_URI, servidor y permisos");
  process.exitCode = 1;
});
