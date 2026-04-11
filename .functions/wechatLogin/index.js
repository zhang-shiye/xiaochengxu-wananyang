const cloud = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });
  
  const db = app.database();
  const { code, userInfo } = event;
  
  try {
    // 1. 使用微信 code 获取 openid (这里需要配置微信开发者凭证)
    // 注意：实际部署时需要配置微信开发者ID和密钥
    const wxResult = await getOpenIdByCode(code);
    
    if (!wxResult.openid) {
      return {
        success: false,
        error: '微信授权失败'
      };
    }
    
    const openid = wxResult.openid;
    
    // 2. 查询员工表中是否已存在该openid
    const employeeResult = await db.collection('employee')
      .where({
        _openid: openid
      })
      .limit(1)
      .get();
    
    let userData;
    
    if (employeeResult.data.length > 0) {
      // 已存在的用户，更新用户信息
      userData = employeeResult.data[0];
      
      // 更新用户信息（如果有提供）
      if (userInfo) {
        await db.collection('employee').doc(userData._id).update({
          data: {
            nickName: userInfo.nickName || userData.nickName,
            avatarUrl: userInfo.avatarUrl || userData.avatarUrl,
            updatedAt: new Date()
          }
        });
      }
    } else {
      // 新用户，创建基础记录（需要后续绑定老人信息）
      const newUser = {
        _openid: openid,
        name: userInfo?.nickName || '微信用户',
        nickName: userInfo?.nickName || '微信用户',
        avatarUrl: userInfo?.avatarUrl || '',
        role: 'family', // 默认为家属角色
        phone: '',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const addResult = await db.collection('employee').add({
        data: newUser
      });
      
      userData = {
        ...newUser,
        _id: addResult._id
      };
    }
    
    return {
      success: true,
      data: {
        userId: userData._id,
        openid: openid,
        role: userData.role,
        name: userData.name,
        nickName: userData.nickName,
        avatarUrl: userData.avatarUrl,
        phone: userData.phone || '',
        isNewUser: employeeResult.data.length === 0
      }
    };
    
  } catch (error) {
    console.error('微信登录错误:', error);
    return {
      success: false,
      error: error.message || '登录失败'
    };
  }
};

// 模拟微信code换取openid的函数
// 实际使用时需要替换为真实的微信API调用
async function getOpenIdByCode(code) {
  // 这里应该调用微信的接口：
  // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=CODE&grant_type=authorization_code
  
  // 模拟返回openid
  return {
    openid: `mock_openid_${Date.now()}`,
    session_key: 'mock_session_key'
  };
}