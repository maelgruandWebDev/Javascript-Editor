require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }}); // Charger Monaco Editor

require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: "let username = prompt('Username : ');\nlet pass1 = '1234';\nlet password = prompt('Password : ');\n\nif (password !== pass1) {\n    console.log('Utilisateur inconnu');\n} else {\n    console.log('Hello user, ', username);\n}",
        language: "javascript"
    });

    document.getElementById("runButton").addEventListener("click", () => {
        const code = editor.getValue();
        runCodeInIframe(code);
    });

    // Fonction pour exécuter le code dans un iframe et rediriger les logs vers l'output
    function runCodeInIframe(code) {
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(iframe);

        const iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();

        // Rediriger les logs vers l'élément #output de l'iframe
        iframeDocument.write(`
            <!DOCTYPE html>
            <html>
            <head><title>Test</title></head>
            <body>
                <div id="consoleOutput" style="background-color: #f0f0f0; padding: 10px; overflow: auto;"></div>
                <script>
                    // Surcharge du console.log pour afficher dans l'élément #consoleOutput
                    const originalLog = console.log;
                    console.log = function(message) {
                        const outputDiv = document.getElementById('consoleOutput');
                        const newLog = document.createElement('div');
                        newLog.textContent = message;
                        outputDiv.appendChild(newLog);
                    };

                    // Fonction pour exécuter le code dynamique
                    function runDynamicCode() {
                        try {
                            // Exécution du code dynamique ici
                            ${code} // Le code est injecté ici
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    // Appeler la fonction pour exécuter le code
                    runDynamicCode();
                </script>
            </body>
            </html>
        `);

        iframeDocument.close();
    }
});
