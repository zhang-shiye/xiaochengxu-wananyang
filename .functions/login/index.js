const cloud = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const { action, userInfo, wechatType, role } = event;
  
  if (action !== 'wechat_login') {
    return {
      success: false,
      error: 'Invalid action'
    };
  }

  try {
    const tcb = cloud.init({
      env: cloud.SYMBOL_CURRENT_ENV,
      // 使用当前云开发环境
    });
    
    const db = tcb.database();
    const _ = db.command;
    
    // 根据微信类型和角色选择不同的集合
    let collectionName;
    let userData;
    
    if (wechatType === 'personal' && role === 'family') {
      // 家属用户 - 使用 family_members 集合
      collectionName = 'family_members';
      
      // 检查是否已存在该用户
      const existingUser = await db.collection(collectionName)
        .where({
          _openid: userInfo.openid
        })
        .get();
      
      if (existingUser.data.length > 0) {
        // 更新用户信息
        userData = {
          ...existingUser.data[0],
          name: userInfo.nickname,
          phone: userInfo.phone || '',
          updatedAt: Date.now()
        };
        
        await db.collection(collectionName)
          .doc(existingUser.data[0]._id)
          .update({
            data: userData
          });
      } else {
        // 创建新用户
        userData = {
          _openid: userInfo.openid,
          name: userInfo.nickname,
          phone: userInfo.phone || '',
          role: role,
          wechatType: wechatType,
          status: 'unbound', // 未绑定老人
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        const result = await db.collection(collectionName).add({
          data: userData
        });
        userData._id = result._id;
      }
    } else {
      // 企业微信用户 - 使用 nurses 集合
      collectionName = 'nurses';
      
      // 检查是否已存在该用户
      const existingUser = await db.collection(collectionName)
        .where({
          _openid: userInfo.openid
        })
        .get();
      
      if (existingUser.data.length > 0) {
        // 更新用户信息
        userData = {
          ...existingUser.data[0],
          name: userInfo.nickname,
          phone: userInfo.phone || '',
          position: userInfo.enterpriseInfo?.position || '护工',
          role: role,
          wechatType: wechatType,
          updatedAt: Date.now()
        };
        
        await db.collection(collectionName)
          .doc(existingUser.data[0]._id)
          .update({
            data: userData
          });
      } else {
        // 创建新用户
        userData = {
          _openid: userInfo.openid,
          name: userInfo.nickname,
          phone: userInfo.phone || '',
          position: userInfo.enterpriseInfo?.position || '护工',
          role: role,
          wechatType: wechatType,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        const result = await db.collection(collectionName).add({
          data: userData
        });
        userData._id = result._id;
      }
    }
    
    return {
      success: true,
      userInfo: userData,
      role: role,
      wechatType: wechatType
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || '登录失败'
    };
  }
};