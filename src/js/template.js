window.addEventListener('load', function(event) {

	const Widget = Vue.createApp({
		data() {
			return {
				from: {
					currency: '',
					currencyImage: '',
					currentAmount: 0,
					minAmount: 0,
					tabIndex: 1,
					search: ''
				},
				to: {
					currency: '',
					currencyImage: '',
					estimatedAmount: 0,
					tabIndex: 2,
					search: ''
				},
				APIKEY: 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd',
				availableCurrenciesList: [],
				error: {
					isError: false,
					errorText: ''
				},
				tabIndex: 0
			}
		},
		computed: {
			availableCurrenciesListFrom() {
				return this.availableCurrenciesList.filter(currency => currency.ticker.indexOf(this.from.search) !== -1)
			},
			availableCurrenciesListTo() {
				return this.availableCurrenciesList.filter(currency => currency.ticker.indexOf(this.to.search) !== -1)
			},
			isDropdownFromActive() {
				return this.from.tabIndex === this.tabIndex
			},
			isDropdownToActive() {
				return this.to.tabIndex === this.tabIndex
			}
		},	
		watch: {
			availableCurrenciesList() {
				this.from.currency = this.availableCurrenciesList[0].ticker
				this.from.currencyImage = this.availableCurrenciesList[0].image
				this.to.currency = this.availableCurrenciesList[1].ticker
				this.to.currencyImage = this.availableCurrenciesList[1].image
			},
			'from.currency'() {
				this.getMinimalExchangeAmount()
			},
			'to.currency'() {
				this.getMinimalExchangeAmount()
			},
			'from.minAmount'() {
				this.from.currentAmount = this.from.minAmount
			},
			'from.currentAmount'() {
				this.getEstimatedExchangeAmount()
			}
		},
		methods: {
			async getAvailableCurrencies() {
				const URL = 'https://api.changenow.io/v1/currencies'

				const response = await fetch(URL)

				if (response.ok) {
					const availableCurrenciesList = await response.json()
					this.availableCurrenciesList = availableCurrenciesList
				}
			},
			async getMinimalExchangeAmount() {
				const from = this.from.currency
				const to = this.to.currency
				const URL = `https://api.changenow.io/v1/min-amount/${from}_${to}?api_key=${this.APIKEY}`
				
				const response = await fetch(URL)

				if (response.ok) {
					const minimalExchangeAmount = await response.json()
					const minimalExchangeAmountValue = minimalExchangeAmount.minAmount

					if (this.from.minAmount !== minimalExchangeAmountValue) {
						this.from.minAmount = minimalExchangeAmountValue
					} else {
						this.from.currentAmount = minimalExchangeAmountValue
						this.getEstimatedExchangeAmount()
					}

					this.removeError()
				} else {
					this.doError('This pair is disabled now')
				}
			},
			async getEstimatedExchangeAmount() {
				const from = this.from.currency
				const to = this.to.currency
				const currentAmount = this.from.currentAmount
				const minAmount = this.from.minAmount

				if ( currentAmount >= minAmount ) {
					const URL = `https://api.changenow.io/v1/exchange-amount/${currentAmount}/${from}_${to}?api_key=${this.APIKEY}`
					const response = await fetch(URL)

					if (response.ok) {
						const estimatedExchangeAmount = await response.json()
						const estimatedExchangeAmountValue = estimatedExchangeAmount.estimatedAmount
						this.to.estimatedAmount = estimatedExchangeAmountValue
						this.removeError()
					} else {
						this.doError('This pair is disabled now')
					}
					
				} else {
					this.doError('The amount is invalid')
				}	
				
			},
			doError(text) {
				this.error.isError = true
				this.error.errorText = text
				this.to.estimatedAmount = '-'
			},
			removeError() {
				this.error.isError = false
			},
			currencyListClickHandler(event) {

				const target = event.target

				if ( target.closest('.currency__dropdown-list-item') ) {
					const currencyItem = target.closest('.currency__dropdown-list-item')
					const currencyList = event.currentTarget
					const direction = currencyList.dataset.direction

					this[direction].currency = currencyItem.dataset.ticker
					this[direction].currencyImage = currencyItem.dataset.image
					this.tabIndex = 0
				}		
				
			},
			closeDropdown(event) {
				if ( !event.target.closest('.currency') ) {
					this.tabIndex = 0
				}
			}

		},
		mounted() {
			this.getAvailableCurrencies()
		}
	})

	Widget.mount('#widget')



});