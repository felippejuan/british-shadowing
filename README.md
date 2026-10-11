# 🇬🇧 The Posh Lab — High Society British Shadowing

Uma plataforma web estática, elegante e interativa para você praticar **Shadowing** e dominar a melodia, o ritmo e a dicção do **Inglês Britânico Moderno da Alta Sociedade** (*Modern Received Pronunciation / Contemporary RP*), no estilo soundboard interativo (inspirado no conceito ágil do *bomdiapainho / myinstants*).

Projetada para **uso pessoal** e **100% gratuita** para rodar no seu próprio **GitHub Pages** (sem backend, sem mensalidades, sem dependências).

---

## 🎩 O Que Está Incluso

1. **Grade Soundboard de Frases & Drills (Mais de 30 frases e palavras-chave):**
   - **Polidez & Diplomacia:** *"I'm afraid that won't be possible"*, *"Would you mind awfully..."*, *"I'd rather not, to be perfectly honest"*.
   - **Social & Conversa do Dia a Dia:** *"Rather brilliant, actually"*, *"Fancy grabbing a quick coffee?"*, *"Spot on"*, *"Shall we call it a day, then?"*.
   - **Reunião & Assertividade:** *"To be quite frank, it's rather underwhelming"*, *"I see your point, but..."*, *"Splendid. We'll touch base tomorrow"*.
   - **Palavras Críticas (Drills de Pronúncia):** *Water*, *Schedule*, *Comfortable*, *Garage*, *Advertisement*, *Tomato*, *Neither*, *Often*.
2. **Estúdio de Shadowing & Gravação Dupla:**
   - **Ouvir Nativo:** Reprodução com voz britânica nítida (`en-GB`).
   - **Controle de Velocidade:** 0.75x (para estudar a boca e a língua), 0.9x e 1.0x (ritmo real).
   - **Gravação de Voz:** Grava seu microfone diretamente pelo navegador com visualizador de onda em tempo real (Canvas).
   - **Comparador Duplo (Dual Play):** Toca o modelo nativo e, em seguida, a sua voz para você notar instantaneamente o descompasso de entonação.
   - **Avaliador Britânico (Speech Recognition):** O navegador ouve sua gravação via motor britânico e dá nota de clareza e correspondência.
3. **Macetes Fonéticos para Brasileiros:**
   - Cada card possui o IPA formal + o "jeitinho brasileiro" de falar (ex: *ráa-dhuh brí-liant, ék-tchu-uh-li*) + a regra de ouro da articulação (evitar o R americano enrolado, usar o T estalado limpo, abrir o Broad A de dentista).
4. **Adicionar Frases Próprias:**
   - Crie novas frases para treinar e salve-as localmente no seu navegador (`localStorage`).
5. **Modo Loop Contínuo:**
   - Deixe uma frase repetindo a cada poucos segundos enquanto você treina a boca sem parar.

---

## 🚀 Como Testar no Seu Computador Agora

Basta abrir o arquivo `index.html` com qualquer navegador (Google Chrome, Microsoft Edge, Safari ou Brave).

Ou, se preferir rodar um servidor local rápido via PowerShell:

```powershell
cd c:\Users\felip\OneDrive\Documentos\antigravity-lab\british-shadowing
# Usando Python (se tiver instalado):
python -m http.server 8080
# Ou npx serve:
npx serve .
```
E acesse no navegador: `http://localhost:8080`.

---

## 🌐 Como Publicar no seu GitHub Pages (Grátis em 2 Minutos)

Como o projeto é 100% estático (apenas `index.html`, `styles.css` e `app.js`), publicá-lo no GitHub Pages é muito simples:

### Passo 1: Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê o nome ao repositório (ex.: `british-shadowing` ou `the-posh-lab`).
3. Deixe como **Public** (necessário para GitHub Pages gratuito).
4. Clique em **Create repository**.

### Passo 2: Subir os Arquivos pelo Terminal
No seu terminal (PowerShell), entre na pasta do projeto e execute:

```powershell
cd c:\Users\felip\OneDrive\Documentos\antigravity-lab\british-shadowing

# Inicializar o repositório git localmente
git init
git add .
git commit -m "feat: initial commit - British Shadowing Studio"

# Conectar ao seu repositório no GitHub (substitua com seu usuário):
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/british-shadowing.git
git push -u origin main
```

### Passo 3: Ativar o GitHub Pages
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione **Deploy from a branch**.
4. Em **Branch**, selecione `main` e a pasta `/ (root)`.
5. Clique em **Save**.
6. Em cerca de 1 a 2 minutos, o GitHub exibirá o link no topo da página:
   `https://SEU_USUARIO.github.io/british-shadowing/`

Pronto! Você poderá acessar de qualquer lugar — inclusive no celular.

---

## 📱 Dica de Uso no Celular (Como App)

Abra o link do seu GitHub Pages no navegador do seu smartphone:
* **No iPhone (Safari):** Toque no botão de Compartilhar (quadrado com seta) > **"Adicionar à Tela de Início"**.
* **No Android (Chrome):** Toque nos 3 pontinhos > **"Adicionar à tela inicial"**.

Ele funcionará como um aplicativo dedicado na tela inicial do seu celular, perfeito para treinar 5 a 10 minutos por dia enquanto toma café ou se arruma!
