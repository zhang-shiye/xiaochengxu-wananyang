// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button, Card } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // 可以在这里添加错误上报逻辑
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };
  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    if (this.props.$w) {
      this.props.$w.utils.redirectTo({
        pageId: 'care-home',
        params: {}
      });
    }
  };
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              页面出现异常
            </h2>
            <p className="text-gray-600 mb-4">
              抱歉，页面加载时出现了问题。请尝试重新加载或返回首页。
            </p>
            
            {this.state.error && <details className="text-left bg-gray-100 rounded-lg p-3 mb-4 text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">
                  错误详情
                </summary>
                <div className="mt-2 text-gray-600">
                  <p><strong>错误信息:</strong> {this.state.error.toString()}</p>
                  {this.state.errorInfo?.componentStack && <pre className="whitespace-pre-wrap mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>}
                </div>
              </details>}
            
            <div className="flex flex-col space-y-3">
              <Button onClick={this.handleReload} className="bg-amber-500 hover:bg-amber-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载页面
              </Button>
              
              <Button onClick={this.handleGoHome} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>
          </Card>
        </div>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;