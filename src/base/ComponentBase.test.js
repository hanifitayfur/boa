import React from 'react';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import ComponentBase from './ComponentBase';
import { context, createShallow, createMount, serviceCallSync } from '../../test/utils';

/* eslint-disable-next-line */
class EmptyComponent extends ComponentBase {
  state = {
    snapshotProperty: 'EmptyComponent',
  }

  render() {
    return (
      <div>
        {this.state.snapshotProperty}
      </div>
    );
  }
}

describe('<ComponentBase /> tests', () => {
  let shallow;
  let mount;

  before(() => {
    shallow = createShallow();
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should render', () => {
    const wrapper = shallow(<EmptyComponent />);
    expect(wrapper.text()).contains('EmptyComponent');
  });

  it('should render with snapshot', () => {
    const wrapper = shallow((
      <EmptyComponent snapshot={{ snapshotProperty: 'TestSnapshot' }} />
    ));
    expect(wrapper.text()).contains('TestSnapshot');
  });

  it('should handle change snapshot prop', () => {
    const wrapper = mount((
      <EmptyComponent snapshot={{ snapshotProperty: 'TestSnapshot' }} />
    ));
    wrapper.setProps({ snapshot: { snapshotProperty: 'ChangedSnapshot' } });
    const snapshotProperty = wrapper.instance().getInstance().getSnapshot().snapshotProperty;
    expect(snapshotProperty).equals('ChangedSnapshot');
  });

  it('should getSnapkey', () => {
    const wrapper = mount((<EmptyComponent snapKey="snapKey" />));
    assert.strictEqual(wrapper.instance().getInstance().getSnapKey('child'), 'snapKey_child');
  });

  it('should getInstance', () => {
    const wrapper = mount((<EmptyComponent context={context} />));
    assert.strictEqual(wrapper.instance(), wrapper.instance().getInstance());
  });

  it('should getMessage', () => {
    const wrapper = mount((<EmptyComponent context={context} />));
    const versions = [{ id: 1, name: 'test', ClassName: 'test', Version: 1 }];
    const messages = [
      {
        Code: 'code',
        Description: 'test',
        GroupName: 'test',
        LanguageId: 1,
        PropertyName: 'test',
      }];

    // eslint-disable-next-line
    const stub = sinon.stub($, 'ajax').callsFake((request) => {
      return serviceCallSync(request, versions, messages);
    });
    assert.strictEqual(wrapper.instance().getInstance().getMessage('test', 'test'), 'test');
    assert.strictEqual(wrapper.instance().getInstance().getMessageCode('test', 'test'), 'code');
    stub.restore();
  });

  it('should validateConstraint', () => {
    const wrapper = mount((<EmptyComponent context={context} />));
    assert.strictEqual(wrapper.instance().getInstance().validateConstraint(), true);
  });
});
