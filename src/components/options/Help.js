import React from 'react'
import showdown from 'showdown'

class Help extends React.Component {
  render() {
    var readme = require('../../../USAGE.md')
    var converter = new showdown.Converter({
      prefixHeaderId: 'welcome ',
      ghCompatibleHeaderId: true,
      simplifiedAutoLink: true
    })

    var html = converter.makeHtml(readme)

    return (
      <div className="content">
        <div className="welcome" dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    )
  }
}

export default Help
