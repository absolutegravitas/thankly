export const StripeExpressElement = () => {
  return (
    <div id="express-checkout-element" style={{ visibility: expressVisibility }}>
      <ExpressCheckoutElement onConfirm={onExpressCheckoutConfirm} onReady={onReady} />
    </div>
  )
}
