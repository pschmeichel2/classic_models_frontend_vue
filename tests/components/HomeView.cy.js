import HomeView from './../../src/views/HomeView.vue'

describe('<HomeView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(HomeView)
  })
})