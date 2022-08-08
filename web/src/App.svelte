<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Home from './routes/Home.svelte'
  import Exchange from './routes/Exchange.svelte'
</script>

<Router>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/exchange/:exchangeAddress/:oldTokenAddress/:newTokenAddress">
    <Exchange />
  </Route>
  <Route path="/exchange/:exchangeAddress/:oldTokenAddress">
    <Exchange />
  </Route>
  <Route path="/exchange/:exchangeAddress">
    <Exchange />
  </Route>
  <Route path="/exchange">
    <Exchange />
  </Route>
</Router>
