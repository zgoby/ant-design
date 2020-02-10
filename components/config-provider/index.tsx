// TODO: remove this lint
// SFC has specified a displayName, but not worked.
/* eslint-disable react/display-name */
import * as React from 'react';
// 统一分类返回为空的组件
import { RenderEmptyHandler } from './renderEmpty';
// 一个更新更新monentLocale和locale.modal的包装组件
import LocaleProvider, { Locale, ANT_MARK } from '../locale-provider';
// 以函数形式传递locale信息的组件
import LocaleReceiver from '../locale-provider/LocaleReceiver';
// ConfigContext的Provider和Consumer
import { ConfigConsumer, ConfigContext, CSPConfig, ConfigConsumerProps } from './context';

export { RenderEmptyHandler, ConfigConsumer, CSPConfig, ConfigConsumerProps };

export const configConsumerProps = [
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
  'pageHeader',
];

export interface ConfigProviderProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
}

class ConfigProvider extends React.Component<ConfigProviderProps> {
  // 定义全局的getPerfixCls,以customize优先
  getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    const { prefixCls = 'ant' } = this.props;

    if (customizePrefixCls) return customizePrefixCls;

    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  };

  renderProvider = (context: ConfigConsumerProps, legacyLocale: Locale) => {
    const {
      children,
      getPopupContainer,
      renderEmpty,
      csp,
      autoInsertSpaceInButton,
      locale,
      pageHeader,
    } = this.props;

    const config: ConfigConsumerProps = {
      ...context,
      getPrefixCls: this.getPrefixCls,
      csp,
      autoInsertSpaceInButton,
    };

    if (getPopupContainer) {
      config.getPopupContainer = getPopupContainer;
    }

    if (renderEmpty) {
      config.renderEmpty = renderEmpty;
    }

    if (pageHeader) {
      config.pageHeader = pageHeader;
    }

    return (
      <ConfigContext.Provider value={config}>
        <LocaleProvider locale={locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
          {children}
        </LocaleProvider>
      </ConfigContext.Provider>
    );
  };

  render() {
    return (
      <LocaleReceiver>
        {(_, __, legacyLocale) => (
          <ConfigConsumer>
            {context => this.renderProvider(context, legacyLocale as Locale)}
          </ConfigConsumer>
        )}
      </LocaleReceiver>
    );
  }
}

export default ConfigProvider;
