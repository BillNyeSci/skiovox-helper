const TextColors = {
    BLACK: 0,
    WHITE: 1
}

class BackgroundController {
    static DEFAULT_COLOR = "#212121";
    static DEFAULT_ALPHA = ".25";

    constructor(colorChange, backgroundChange) {
        this.colorChange = colorChange
        this.backgroundChange = backgroundChange
        this.makeInputs()
        this.startListeners()
        this.displaySavedProperties()
    }

    makeInputs() {
        this.colorInput = document.createElement('input')
        this.colorInput.value = this.getSavedColor()
        this.colorInput.type = "color"
        this.alphaInput = document.createElement('input')
        this.alphaInput.min = 0
        this.alphaInput.max = 100
        this.alphaChange = this.alphaInput
        this.colorInput.value = this.getSavedAlpha()
        this.alphaInput.type = 'range'

        let styleColor = this.colorInput.style
        styleColor.position = "fixed"
        styleColor.display = "block"
        styleColor.bottom = "30px"
        styleColor.left = "0px"
        styleColor.visibility = "hidden"
        document.body.appendChild(this.colorInput)

        let styleAlpha = this.alphaInput.style
        styleAlpha.position = "fixed"
        styleAlpha.display = "block"
        styleAlpha.bottom = "15px"
        styleAlpha.left = "230px"
        styleAlpha.visibility = "hidden"
        document.body.appendChild(this.alphaInput)
        
        function hideAlpha(ev){
            if( ev.target.nodeName !== 'INPUT' ){
                styleAlpha.visibility = "hidden"
            }
        }
        document.body.addEventListener("mousedown", hideAlpha);

        this.fileInput = document.createElement('input')
        this.fileInput.type = "file"
        this.fileInput.accept = "image/png, image/jpeg, image/gif, image/webp"
        this.fileInput.style.visibility = "hidden"
        document.body.appendChild(this.fileInput)
    }

    startListeners() {
        this.colorChange.addEventListener('click', this.onClickedColor.bind(this))
        this.colorInput.addEventListener('input', this.onInputColor.bind(this))
        this.alphaInput.addEventListener('input', this.onInputColor.bind(this))
        this.backgroundChange.addEventListener('click', this.onClickedBackground.bind(this))
        this.fileInput.addEventListener('change', this.onInputFile.bind(this))
    }

    onClickedColor() {
        this.colorInput.click()
        this.alphaInput.style.visibility = "visible"
    }

    onClickedBackground() {
        this.fileInput.click()
    }

    onInputColor() {
        let colorValue = this.colorInput.value
        let colorAlpha = this.alphaInput.value
        this.setSavedColor(colorValue, colorAlpha)
        this.displayColor(colorValue, colorAlpha)
    }

    onInputFile() {
        if (!this.fileInput.files) {return}
        let reader = new FileReader()
        reader.readAsDataURL(this.fileInput.files[0])
        let controller = this
        reader.addEventListener('load', async function() {
            controller.displayBackground(reader.result)
            controller.setSavedFile(reader.result)
        })
    }

    getSavedColor() {
        return localStorage.savedColor ?? BackgroundController.DEFAULT_COLOR
    }
    getSavedAlpha() {
        return localStorage.savedAlpha ?? 1
    }

    getSavedBackground() {
        return localStorage.savedBackground
    }

    setSavedColor(colorValue, colorAlpha) {
        localStorage.savedColor = colorValue
        localStorage.savedAlpha = colorAlpha
    }

    setSavedFile (file) {
        try {
            localStorage.savedBackground = file
        }
        catch {
            alert("This image is larger then 5mb and cannot be saved.")
        }
    }

    hasSavedColor() {
        return Boolean(localStorage.savedColor)
    }

    hasSavedBackground() {
        return Boolean(localStorage.savedBackground)
    }

    displayColor(colorValue, colorAlpha) {
        let red = parseInt(colorValue.substring(1,3), 16)
        let green = parseInt(colorValue.substring(3,5), 16)
        let blue = parseInt(colorValue.substring(5,7), 16)
        let rgba = `rgba(${red}, ${green}, ${blue}, ${colorAlpha/100})`

        let background = document.querySelectorAll('.background')
        document.body.style.backgroundColor = colorValue
        background.forEach(obj => obj.style.backgroundColor = rgba)

        if (BackgroundController.getTextColor(colorValue) === TextColors.BLACK) {
            this.colorInput.style.colorScheme = "light"
            document.body.classList.add("black-text")
        } else {
            document.body.classList.remove("black-text")
            this.colorInput.style.colorScheme = "dark"
        }
    }

    displayBackground(background) {
        document.body.style.backgroundImage = `url(${background})`
    }

    displaySavedProperties() {
        if (this.hasSavedColor()) {
            this.displayColor(this.getSavedColor(), this.getSavedAlpha())
        }
        if (this.hasSavedBackground()) {
            this.displayBackground(this.getSavedBackground())
        }else{
            this.displayBackground("https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1280&")
        }
    }

    static getTextColor(color) {
        let [r, g, b] = [1, 3, 5].map(n => parseInt(color.substr(n, 2), 16));
        let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? TextColors.BLACK : TextColors.WHITE;
    }
}

export { BackgroundController }