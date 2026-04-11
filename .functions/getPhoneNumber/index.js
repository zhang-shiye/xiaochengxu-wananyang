const cloud = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });
  
  const db = app.database();
  const { encryptedData, iv, sessionKey, userId } = event;
  
  try {
    // 解密手机号数据
    // 注意：实际使用时需要正确的解密算法和微信session_key
    const phoneData = decryptPhoneNumber(encryptedData, iv, sessionKey);
    
    if (!phoneData || !phoneData.phoneNumber) {
      return {
        success: false,
        error: '手机号获取失败'
      };
    }
    
    // 更新用户手机号
    await db.collection('employee').doc(userId).update({
      data: {
        phone: phoneData.phoneNumber,
        updatedAt: new Date()
      }
    });
    
    return {
      success: true,
      data: {
        phoneNumber: phoneData.phoneNumber
      }
    };
    
  } catch (error) {
    console.error('获取手机号错误:', error);
    return {
      success: false,
      error: error.message || '获取手机号失败'
    };
  }
};

// 模拟解密手机号的函数
// 实际使用时需要正确的解密算法
function decryptPhoneNumber(encryptedData, iv, sessionKey) {
  // 这里应该使用微信提供的解密算法
  // 需要用到sessionKey和appId进行解密
  
  // 模拟返回手机号
  return {
    phoneNumber: `138${Math.floor(Math.random() * 100000000)}`,
    purePhoneNumber: `138${Math.floor(Math.random() * 100000000)}`,
    countryCode: '86'
  };
}