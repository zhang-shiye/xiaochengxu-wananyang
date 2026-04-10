// @ts-ignore;
import React from 'react';

/**
 * 数据权限检查工具组件
 * 用于控制不同角色的数据访问权限
 */
export const DataPermissionHelper = {
  /**
   * 检查用户是否有权限执行数据操作
   * @param {Object} user - 用户信息
   * @param {string} requiredRole - 需要的角色类型
   * @returns {boolean} 是否有权限
   */
  hasDataPermission: (user, requiredRole) => {
    if (!user?.userId) {
      return false;
    }

    // 家属端权限
    if (requiredRole === 'family') {
      return user.type === 'family';
    }

    // 管理端权限
    if (requiredRole === 'admin') {
      const allowedTypes = ['nurse', 'staff', 'admin'];
      return allowedTypes.includes(user.type);
    }
    return false;
  },
  /**
   * 构建家属端数据查询条件
   * @param {Object} user - 用户信息
   * @param {Object} db - 数据库实例
   * @param {string} collectionName - 集合名称
   * @returns {Promise<Object>} 查询条件对象
   */
  buildFamilyQuery: async (user, db, collectionName) => {
    const _ = db.command;
    try {
      if (!user?.userId || user?.type !== 'family') {
        return null;
      }

      // 查询家属绑定的老人信息
      const familyResult = await db.collection('family_members').where({
        _openid: _.eq(user.userId),
        status: _.eq('bound')
      }).get();
      if (familyResult.data.length === 0) {
        return {
          none: _.eq('none')
        }; // 返回空数据
      }
      const elders = familyResult.data;

      // 根据不同集合构建不同的查询条件
      switch (collectionName) {
        case 'daily_reports':
        case 'leave_requests':
          return {
            elderId: _.in(elders.map(e => e.elderId))
          };
        case 'bills':
          return {
            elderName: _.in(elders.map(e => e.elderName))
          };
        default:
          return {};
      }
    } catch (error) {
      console.error('构建家属查询条件失败:', error);
      return {
        none: _.eq('none')
      };
    }
  },
  /**
   * 验证数据创建权限
   * @param {Object} user - 用户信息
   * @param {Object} data - 要创建的数据
   * @param {string} collectionName - 集合名称
   * @returns {Promise<Object>} 验证结果 { hasPermission: boolean, errorMessage?: string }
   */
  validateCreatePermission: async (user, data, collectionName) => {
    try {
      if (!user?.userId) {
        return {
          hasPermission: false,
          errorMessage: '用户未登录'
        };
      }

      // 家属权限检查
      if (user.type === 'family') {
        const tcb = await window.$w?.cloud?.getCloudInstance();
        if (!tcb) {
          return {
            hasPermission: false,
            errorMessage: '系统异常'
          };
        }
        const db = tcb.database();
        const _ = db.command;

        // 检查是否绑定了老人
        const familyResult = await db.collection('family_members').where({
          _openid: _.eq(user.userId),
          status: _.eq('bound')
        }).get();
        if (familyResult.data.length === 0) {
          return {
            hasPermission: false,
            errorMessage: '请先绑定老人信息'
          };
        }

        // 验证数据是否属于绑定的老人
        const elderIds = familyResult.data.map(e => e.elderId);
        const elderNames = familyResult.data.map(e => e.elderName);
        if (data.elderId && !elderIds.includes(data.elderId)) {
          return {
            hasPermission: false,
            errorMessage: '无权操作该老人的数据'
          };
        }
        if (data.elderName && !elderNames.includes(data.elderName)) {
          return {
            hasPermission: false,
            errorMessage: '无权操作该老人的数据'
          };
        }
        return {
          hasPermission: true
        };
      }

      // 管理端权限检查
      if (['nurse', 'staff', 'admin'].includes(user.type)) {
        return {
          hasPermission: true
        };
      }
      return {
        hasPermission: false,
        errorMessage: '权限不足'
      };
    } catch (error) {
      console.error('数据权限验证失败:', error);
      return {
        hasPermission: false,
        errorMessage: '权限验证失败'
      };
    }
  },
  /**
   * 获取用户绑定的老人列表
   * @param {Object} user - 用户信息
   * @param {Object} db - 数据库实例
   * @returns {Promise<Array>} 老人列表
   */
  getUserBoundElders: async (user, db) => {
    try {
      if (!user?.userId) {
        return [];
      }
      const _ = db.command;
      const familyResult = await db.collection('family_members').where({
        _openid: _.eq(user.userId),
        status: _.eq('bound')
      }).get();
      return familyResult.data.map(f => ({
        elderId: f.elderId,
        elderName: f.elderName,
        relationship: f.relationship
      }));
    } catch (error) {
      console.error('获取绑定老人列表失败:', error);
      return [];
    }
  }
};
export default DataPermissionHelper;