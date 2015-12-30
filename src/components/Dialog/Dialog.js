import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import config from '../../config';

export default class Dialog extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    header: PropTypes.node,
    footer: PropTypes.node,
    children: PropTypes.node
  };

  render() {
    const {onOk, onCancel, header, title, footer, children} = this.props;

    const styles = require('./Dialog.scss');
    return (
      <div>
        <div className="modal-backdrop fade in" onClick={onCancel()}></div>
        <div className={styles.seasons + ' modal fade in'} tabIndex={-1} role="dialog" style={{display: 'block'}}>
          <DocumentMeta title={config.app.title + ': ' + title}/>
          <div className={styles.modal + ' modal-dialog'}>
            <div className="modal-content">
              <div className="modal-header">
                {header ||
                  <div>
                    <button type="button" className="close" aria-label="Close" onClick={onCancel()}><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">{title}</h4>
                  </div>
                  }
              </div>
              <div className="modal-body">
                {children}
              </div>
              <div className="modal-footer">
                {footer ||
                <div>
                  <button type="button" className="btn btn-default" onClick={onCancel()}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={onOk()}>Ok</button>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
