import Nav from "./Nav";

export default function Investments() {

  return (
    <>
      <div className="app2">
        <Nav />
        <div className="investments-wrapper">
          <div className="investments-heading-profile-overview-wrapper">
            <h1 className="investments-heading">Investments</h1>
            <div className="total-investments-wrapper">
              <img className="dollar-sign-icon" alt="dollar-sign-icon" src="/images/hand-and-dollar-sign-icon.png"></img>
              <h1 className="total-investments-heading">Total Invested</h1>
            </div>
            <div className="number-of-investments-wrapper">
              <img className="stack-of-coins-icon" alt="stack-of-coins-icon" src="public/images/stack-of-coins-icon.png"></img>
              <h1 className="number-of-investments-heading">No. of Investments</h1>
            </div>
            <div className="rate-of-return-wrapper">
              <img className="rate-of-return-icon" alt="rate-of-return-icon" src="/images/rate-of-return-icon.png"></img>
              <h1 className="rate-of-return-heading">Rate of Return</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}