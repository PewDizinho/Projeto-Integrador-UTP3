import si from "systeminformation";

(async () => {
    try {
        const disk = await si.fsSize();
        console.log(disk);
    } catch (err) {
        console.error("Erro ao obter informações de disco:", err);
    }
})();