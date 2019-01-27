import React from 'react';
import ReactDOM from 'react-dom';
import { assert } from 'chai';
import { spy, stub } from 'sinon';
import keycode from 'keycode';
import Modal from '@material-ui/core/Modal';
import Popover from './Popover';
import { context, createMount, createShallow } from '@boa/test/utils';

describe('<Popover />', () => {
  let mount;
  let shallow;

  before(() => {
    mount = createMount();
    shallow = createShallow({ untilSelector: 'Popover' });
  });

  after(() => {
    mount.cleanUp();
  });

  it('should change open status with instance method', () => {
    const wrapper = mount(<Popover context={context} />);
    wrapper
      .instance()
      .getInstance()
      .openPopover();
    assert.strictEqual(wrapper.state().open, true);
    wrapper
      .instance()
      .getInstance()
      .openPopover();
    assert.strictEqual(wrapper.state().open, false);
    wrapper
      .instance()
      .getInstance()
      .manualOpen();
    assert.strictEqual(wrapper.state().open, true);
    wrapper
      .instance()
      .getInstance()
      .manualClose();
    assert.strictEqual(wrapper.state().open, false);
  });

  it('should pass onClose prop to Modal', () => {
    const fn = () => {};
    const wrapper = shallow(
      <Popover open={false} onRequestClose={fn}>
        <div />
      </Popover>,
    );
    assert.strictEqual(wrapper.props().onClose, fn, 'should be the onClose function');
  });

  describe('onRequestClose', () => {
    it('should fire onRequestClose', () => {
      const onRequestClose = spy();
      const topModalStub = stub();
      topModalStub.returns(true);
      const wrapper = mount(
        <Popover
          open={false}
          onRequestClose={onRequestClose}
          manager={{ isTopModal: topModalStub }}
        >
          <div />
        </Popover>,
      );
      const modal = wrapper.find(Modal).childAt(0);
      const event = { keyCode: keycode('esc') };
      modal.instance().handleDocumentKeyDown(event);
      assert.strictEqual(onRequestClose.callCount, 1);
    });

    it('should fire onRequestClose from instance', () => {
      const onRequestClose = spy();
      const wrapper = mount(
        <Popover open={false} onRequestClose={onRequestClose}>
          <div />
        </Popover>,
      );
      wrapper.instance().onRequestClose();
      assert.strictEqual(onRequestClose.callCount, 1);
    });

    it('should fire onRequestClose from instance clickAway', () => {
      const wrapper = mount(
        <Popover open>
          <div />
        </Popover>,
      );
      wrapper.instance().onRequestClose('clickAway');
      assert.strictEqual(wrapper.state().open, false);
    });

    it('should fire onRequestClose from Modal', () => {
      const onRequestClose = spy();
      const topModalStub = stub();
      topModalStub.returns(true);
      const wrapper = mount(
        <Popover
          open={false}
          onRequestClose={onRequestClose}
          manager={{ isTopModal: topModalStub }}
        >
          <div />
        </Popover>,
      );
      const modal = wrapper.find(Modal).childAt(0);
      const event = { keyCode: keycode('esc') };
      modal.instance().handleDocumentKeyDown(event);
      assert.strictEqual(onRequestClose.callCount, 1);
    });
  });

  it('should mount with resizable', () => {
    const wrapper = mount(
      <Popover context={context} open resizable>
        <div>test</div>
      </Popover>,
    );
    wrapper
      .instance()
      .getInstance()
      .onResize({}, 'test', { height: 11, width: 13 });
    const resizableParent = ReactDOM.findDOMNode(wrapper.instance().resizable).parentNode;
    assert.strictEqual(resizableParent.style.height, '11px');
    assert.strictEqual(resizableParent.style.width, '13px');
  });

  it('should fire onResize', () => {
    const onResize = spy();
    const wrapper = mount(
      <Popover context={context} onResize={onResize} open resizable>
        <div>test</div>
      </Popover>,
    );
    wrapper
      .instance()
      .getInstance()
      .onResize({}, 'test', { height: 11, width: 13 });
    assert.strictEqual(onResize.callCount, 1);
  });
});