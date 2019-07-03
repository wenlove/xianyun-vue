//本地存储登录数据
export const state = () => {
    return {
        userInfo: {
            token: "",
            user: {}
        }
    }
};


export const mutations = {
    setUserInfo(state, data) {
        state.userInfo = data;
        // console.log(data);
    },
    //设置用户数据为空,实现退出
    clearUserInfo(state) {
        state.userInfo = {
            token: "",
            user: {}
        };
    }
};


export const actions = {
    //登录
    login({ commit }, data) {
        return this.$axios({
            url: "/accounts/login",
            method: "POST",
            data
        }).then(res => {
            // console.log(res);
            const { status, data } = res;
            if (status === 200) {
                //   console.log(data);
                commit("setUserInfo", data);
                return data;
            }
        });
    }
};