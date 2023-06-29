/*
 * @Author: zdd
 * @Date: 2023-06-27 22:27:49
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-27 22:30:55
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/Materials/index.tsx
 * @Description: 
 */
import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const MaterialsPage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={'Materials'} />
      </div>
    </PageContainer>
  );
};

export default MaterialsPage;
