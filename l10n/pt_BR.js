OC.L10N.register(
    "end_to_end_encryption",
    {
    "This is someone else's private key" : "Essa é a chave privada de outra pessoa",
    "Could not find the private key of the user %s" : "Não foi possível encontrar a chave privada do usuário %s",
    "Internal error" : "Erro interno",
    "You are not allowed to delete this private key" : "Você não tem permissão para excluir esta chave privada",
    "Could not find the private key belonging to the user %s" : "Não foi possível encontrar a chave privada pertencente ao usuário %s",
    "Could not find the public key belonging to the user %s" : "Não foi possível encontrar a chave pública pertencente ao usuário %s",
    "Common name (CN) does not match the current user" : "Common name (CN) não confere com a do usuário atual",
    "Could not find the public key belonging to %s" : "Não foi possível encontrar a chave pública pertencente a %s",
    "This is not your public key to delete" : "Esta não é sua chave pública a excluir",
    "Cannot decode userlist" : "Não é possível decodificar a lista de usuários ",
    "X-NC-E2EE-COUNTER is missing in the request" : "X-NC-E2EE-COUNTER está faltando na solicitação",
    "You are not allowed to create the lock" : "Você não tem permissão para criar o bloqueio ",
    "You are not allowed to lock the root" : "Você não tem permissão para bloquear o root",
    "File already locked" : "Arquivo já bloqueado",
    "e2e-token is empty" : "e2e-token está vazio",
    "You are not allowed to remove the lock" : "Você não ter permissão para remover o bloqueio",
    "File not locked" : "O arquivo não bloqueado",
    "Could not find metadata for \"%s\"" : "Não foi possível encontrar metadados para \"%s\"",
    "Cannot read metadata" : "Não é possível ler metadados ",
    "X-NC-E2EE-SIGNATURE is empty" : "X-NC-E2EE-SIGNATURE está vazio",
    "You are not allowed to edit the file, make sure to first lock it, and then send the right token" : "Você não tem permissão para editar o arquivo. Certifique-se de bloqueá-lo e então envie o token correto",
    "Cannot store metadata" : "Não é possível armazenar metadados ",
    "Metadata-file does not exist" : "Arquivo de metadados não existe",
    "Only the owner can delete the metadata-file" : "Somente o proprietário pode excluir o arquivo de metadados",
    "Cannot delete metadata" : "Não é possível excluir metadados ",
    "Cannot update filedrop" : "Não é possível atualizar filedrop",
    "Encrypted share" : "Compartilhamento criptografado",
    "End-to-End Encryption" : "Criptografia de ponta-a-ponta",
    "End-to-end encryption endpoint" : "Ponto final da criptografia de ponta-a-ponta",
    "This app provides all the necessary APIs to implement End-to-End encryption on the client side.\nAdditionally it implements Secure FileDrop and makes sure that End-to-End encrypted files are neither accessible via the web interface nor other WebDAV clients." : "Esse aplicativo fornece todas as APIs necessárias para implementar a criptografia de ponta a ponta no lado do cliente.\nAlém disso, ele implementa o Secure FileDrop e garante que os arquivos criptografados de ponta a ponta não sejam acessíveis pela interface da Web nem por outros clientes WebDAV.",
    "Saved groups" : "Grupos salvos",
    "Limit to groups" : "Limitar a grupos",
    "When at least one group is selected, only people of the listed groups can use the End-to-End encryption app." : "Quando pelo menos um grupo é selecionado, apenas as pessoas dos grupos listados podem usar o aplicativo de criptografia de ponta a ponta.",
    "Limit app usage to groups" : "Limitar o uso de aplicativos a grupos",
    "Save" : "Salvar",
    "Submit" : "Enviar",
    "Enter your 12 words mnemonic" : "Digite seu mnemônico de 12 palavras",
    "Decrypting your files in the browser can weaken security" : "A descriptografia de seus arquivos no navegador pode enfraquecer a segurança",
    "The server could serve malicious source code to extract the secret that protects your files." : "O servidor pode fornecer código-fonte malicioso para extrair o segredo que protege seus arquivos.",
    "I understand the risks" : "Eu entendo os riscos",
    "Mnemonic" : "Mnemônico",
    "Confirm resetting keys" : "Confirmar a redefinição das chaves",
    "This is the final warning: Do you really want to reset your keys?" : "Este é o aviso final: você realmente deseja redefinir suas chaves?",
    "Cancel" : "Cancelar",
    "Reset keys" : "Redefinir chaves",
    "End-to-end encryption is currently enabled and correctly setup." : "A criptografia de ponta a ponta está atualmente habilitada e configurada corretamente.",
    "End-to-end encryption is currently disabled. You can set it up with the {productName} clients." : "A criptografia de ponta a ponta está desativada no momento. Você pode configurá-lo com os clientes {productName}.",
    "End-to-end encryption keys reset" : "Chaves de criptografia de ponta a ponta redefinidas",
    "Unable to reset end-to-end encryption" : "Não é possível redefinir a criptografia de ponta a ponta",
    "End-to-end encryption" : "Criptografia de ponta a ponta",
    "Enable E2EE navigation in browser" : "Ativar navegação de criptografia ponta a ponta no navegador",
    "Enabling E2EE in the browser can weaken security" : "A ativação da criptografia de ponta a ponta pode enfraquecer a segurança",
    "Close" : "Fechar",
    "Reset end-to-end encryption" : "Redefinir criptografia de ponta a ponta",
    "Please read carefully before resetting your end-to-end encryption keys" : "Leia atentamente antes de redefinir suas chaves de criptografia de ponta a ponta",
    "Once your end-to-end encryption keys are reset, all files stored in your encrypted folder will be inaccessible." : "Depois que suas chaves de criptografia de ponta a ponta forem redefinidas, todos os arquivos armazenados em sua pasta criptografada ficarão inacessíveis.",
    "You should only reset your end-to-end encryption keys if you lost your secure key words (mnemonic)." : "Você só deve redefinir suas chaves de criptografia de ponta a ponta se perder suas palavras-chave seguras (mnemônico).",
    "Check on all connected devices if you can retrieve your mnemonic." : "Verifique em todos os dispositivos conectados se você pode recuperar seu mnemônico.",
    "Any still connected device might cause problems after deleting the keys, so it is better to disconnect and reconnect the devices again." : "Qualquer dispositivo ainda conectado pode causar problemas após a exclusão das chaves, portanto, é melhor desconectar e reconectar os dispositivos novamente.",
    "Delete existing encrypted files" : "Excluir arquivos criptografados existentes",
    "Error while uploading files" : "Erro ao enviar arquivos",
    "Error while uploading metadata" : "Erro ao carregar metadados",
    "Select or drop files" : "Selecione ou solte arquivos",
    "Upload encrypted files to {fileName}" : "Upload encrypted files to {fileName}",
    "Download unencrypted" : "Download não criptografado",
    "Provides the necessary endpoint to enable end-to-end encryption.\n\n**Notice:** E2EE is currently not compatible to be used together with server-side encryption" : "Fornece o endpoint necessário para habilitar a criptografia de ponta a ponta.\n\n**Aviso:** E2EE atualmente não é compatível para ser usado junto com a criptografia do lado do servidor",
    "Limit app usage to groups." : "Limitar o uso de aplicativos para grupos."
},
"nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;");
