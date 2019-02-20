import React from 'react';
import PropTypes from 'prop-types';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Button } from '@boa/components/Button';
import DialogHelper from './DialogHelper';
import {
  prepareDialog,
  prepareDialogFormStyle,
  prepareCloseButtonStyle,
  prepareTitleStyle,
  createDialogContent,
  getTitleBackground,
} from './helpers';

const styles = () => ({
  paper: {
    borderRadius: 8,
  },
});
/**
 * Dialog Component is wrapped from `@material-ui/core/Dialog`.
 * Also `DialogHelper` provides a static method called `show`
 * This method allows create window from outside the render method.
 */
@ComponentComposer
@withStyles(styles)
class Dialog extends ComponentBase {
  static propTypes = {
    /**
     * Base properties from ComponentBase.
     */
    ...ComponentBase.propTypes,
    /**
     * Dialog children, usually the included sub-components.
     */
    autoDetectWindowHeight: PropTypes.bool,
    /**
     * Dialog children, usually the included sub-components.
     */
    children: PropTypes.node,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * If `true`, hitting escape will not fire the `onClose` callback.
     */
    content: PropTypes.any,
    /**
     * If `true`, it will be full-screen
     */
    dialogBoxContentPadding: PropTypes.any,
    /**
     * If `true`, clicking the backdrop will not fire the `onClose` callback.
     */
    disableBackdropClick: PropTypes.bool,
    /**
     * If `true`, hitting escape will not fire the `onClose` callback.
     */
    disableEscapeKeyDown: PropTypes.bool,
    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden.
     * (input bileşeninin focusunda açıyorsanız can kurtarır!)
     */
    disableRestoreFocus: PropTypes.bool,
    /**
     * If `true`, it will be full-screen
     */
    fullScreen: PropTypes.bool,
    /**
     * If specified, stretches dialog to max width.
     */
    fullWidth: PropTypes.bool,
    /**
     * Determine the max width of the dialog.
     * The dialog width grows with the size of the screen, this property is useful
     * on the desktop where you might need some coherent different width size across your
     * application. Set to `false` to disable `maxWidth`.
     */
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', false]),
    /**
     * Callback fired when the backdrop is clicked.
     */
    onBackdropClick: PropTypes.func,
    /**
     * Callback fired when the component requests to be closed.
     *
     * @param {object} event The event source of the callback
     */
    onClose: PropTypes.func,
    /**
     * Callback fired before the dialog enters.
     */
    onEnter: PropTypes.func,
    /**
     * Callback fired when the dialog has entered.
     */
    onEntered: PropTypes.func,
    /**
     * Callback fired when the dialog is entering.
     */
    onEntering: PropTypes.func,
    /**
     * Callback fired when the escape key is pressed,
     * `disableKeyboard` is false and the modal is in focus.
     */
    onEscapeKeyDown: PropTypes.func,
    /**
     * Callback fired before the dialog exits.
     */
    onExit: PropTypes.func,
    /**
     * Callback fired when the dialog has exited.
     */
    onExited: PropTypes.func,
    /**
     * Callback fired when the dialog is exiting.
     */
    onExiting: PropTypes.func,
    /**
     * If `true`, the Dialog is open.
     */
    open: PropTypes.bool.isRequired,
    /**
     * Properties applied to the `Paper` element.
     */
    PaperProps: PropTypes.object,
    repositionOnUpdate: PropTypes.bool,
    showHeader: PropTypes.bool,
    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden.
     */
    titleWithCloseButtonEnabled: PropTypes.bool,
    /**
     * Transition component.
     */
    transition: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     */
    transitionDuration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    fullScreen: false,
    fullWidth: false,
    disableBackdropClick: false,
    disableEscapeKeyDown: false,
    titleWithCloseButtonEnabled: false,
    autoDetectWindowHeight: true,
    // autoScrollBodyContent: false,
    modal: false,
    repositionOnUpdate: true,
    showHeader: true,
    dialogBoxContentPadding: '24px',
  };

  state = {
    open: this.props.open,
    title: this.props.title,
  };

  constructor(props, context) {
    super(props, context);
    this.fireClosable = this.fireClosable.bind(this);
    this.open = this.open.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { open, title } = nextProps;
    this.setState({ open, title });
  }

  componentWillMount() {
    super.componentWillMount();
  }

  setTitle(title) {
    this.setState({ title, noBackgroudChange: true });
  }

  setLeftTitleButton(value) {
    this.setState({ leftTitleButton: value });
  }

  open(open) {
    this.setState({ open }, () => {
      /* istanbul ignore else */
      if (open === false) {
        DialogHelper.clearRefs(this.props.dialogKey);
      }
    });
  }

  fireClosable() {
    /* istanbul ignore else */
    if (this.props.onClosing) {
      this.props.onClosing(this, DialogHelper.getContentRef(this.props.dialogKey));
    }
  }

  onEnter() {
    const scrollDiv = document.getElementById('scrollDiv');
    if (scrollDiv != null) {
      if (scrollDiv.offsetHeight < scrollDiv.scrollHeight) {
        scrollDiv.style.borderBottomColor = this.props.context.theme.boaPalette.base200;
        scrollDiv.style.borderBottomStyle = 'solid';
        scrollDiv.style.borderBottomWidth = 1;
      } else {
        scrollDiv.style.borderBottomColor = 'transparent';
      }
    }
  }

  render() {
    const { leftTitleButton, title } = this.state;
    const context = this.props.context;
    const dialog = prepareDialog(this.props);
    const titleBackgroundColor = getTitleBackground(DialogHelper.dialogRefs, context);
    const dialogFormStyle = prepareDialogFormStyle(context, titleBackgroundColor);
    const closeButtonStyle = prepareCloseButtonStyle(context);
    const titleStyle = prepareTitleStyle(context, leftTitleButton);

    let dialogForm;
    let dialogBoxContent;

    if (this.props.showHeader) {
      dialogForm = (
        <MuiDialogTitle disableTypography style={dialogFormStyle}>
          {leftTitleButton && <div>{leftTitleButton}</div>}
          <div style={titleStyle}>{title}</div>
          <div style={closeButtonStyle}>
            <Button
              context={context}
              type="icon"
              style={{ width: '40px', height: '40px' }}
              dynamicIcon={'Close'}
              iconProperties={{ nativeColor: context.theme.boaPalette.comp500 }}
              onClick={this.props.onRequestClose}
            />
          </div>
        </MuiDialogTitle>
      );
    }

    if (this.props.style) {
      dialogBoxContent = (
        <MuiDialogContent style={this.props.style}>{dialog.dialogContent}</MuiDialogContent>
      );
    } else {
      dialogBoxContent = createDialogContent(this.props, dialog);
    }

    return (
      <MuiDialog
        classes={this.props.classes}
        fullScreen={dialog.fullScreen}
        fullWidth={this.props.fullWidth}
        open={this.state.open}
        onClose={this.props.onRequestClose}
        PaperProps={{ style: dialog.customContentStyle }}
        onEntered={this.onEnter}
        onExiting={this.fireClosable}
        disableRestoreFocus={this.props.disableRestoreFocus}
      >
        {dialog.titleWithCloseButtonEnabled && dialogForm}
        {dialog.titleWithCloseButtonEnabled ? dialog.dialogContent : dialogBoxContent}
        {!dialog.titleWithCloseButtonEnabled && this.props.actions && (
          <MuiDialogActions>{this.props.actions}</MuiDialogActions>
        )}
        <div
          id={`snack-bar-element-instance-${this.props.dialogKey}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </MuiDialog>
    );
  }
}

export default Dialog;
