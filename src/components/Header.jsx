export default function Header({data}) {
    return (
        <header className="header">
        <div className="logo">PINCH</div>
        <div className="job-info">
          <div><strong>Job TRK #{data.idJob}</strong></div>
          <div>{data.name}</div>
        </div>
      </header>
    )
  }