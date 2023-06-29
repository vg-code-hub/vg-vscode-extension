/*
 * @Author: zdd
 * @Date: 2023-06-27 22:27:49
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-27 22:28:13
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/Scaffold/index.tsx
 * @Description: 
 */
import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const ScaffoldPage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={'Scaffold'} />
      </div>
    </PageContainer>
  );
};

export default ScaffoldPage;
