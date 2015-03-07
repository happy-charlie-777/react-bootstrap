import React from 'react';
import joinClasses from './utils/joinClasses';
import classSet from './utils/classSet';
import cloneWithProps from './utils/cloneWithProps';

import ValidComponentChildren from './utils/ValidComponentChildren';
import createChainedFunction from './utils/createChainedFunction';
import BootstrapMixin from './BootstrapMixin';

const SubNav = React.createClass({
  mixins: [BootstrapMixin],

  propTypes: {
    onSelect: React.PropTypes.func,
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    href: React.PropTypes.string,
    title: React.PropTypes.string,
    text: React.PropTypes.node,
    target: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      bsClass: 'nav'
    };
  },

  handleClick(e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
      }
    }
  },

  isActive() {
    return this.isChildActive(this);
  },

  isChildActive(child) {
    if (child.props.active) {
      return true;
    }

    if (this.props.activeKey != null && this.props.activeKey === child.props.eventKey) {
      return true;
    }

    if (this.props.activeHref != null && this.props.activeHref === child.props.href) {
      return true;
    }

    if (child.props.children) {
      let isActive = false;

      ValidComponentChildren.forEach(
        child.props.children,
        function (grandchild) {
          if (this.isChildActive(grandchild)) {
            isActive = true;
          }
        },
        this
      );

      return isActive;
    }

    return false;
  },

  getChildActiveProp(child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey === this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },

  render() {
    let classes = {
      'active': this.isActive(),
      'disabled': this.props.disabled
    };

    return (
      <li {...this.props} className={joinClasses(this.props.className, classSet(classes))}>
        <a
          href={this.props.href}
          title={this.props.title}
          target={this.props.target}
          onClick={this.handleClick}
          ref="anchor">
          {this.props.text}
        </a>
        <ul className="nav">
          {ValidComponentChildren.map(this.props.children, this.renderNavItem)}
        </ul>
      </li>
    );
  },

  renderNavItem(child, index) {
    return cloneWithProps(
      child,
      {
        active: this.getChildActiveProp(child),
        onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
        ref: child.ref,
        key: child.key ? child.key : index
      }
    );
  }
});

export default SubNav;
