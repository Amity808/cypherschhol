const webhooksRoutes = {
  CreateCourse: async (req, res) => {
      try {
          return res.status(200).json({ status: true }); 
      } catch (error) {
        return res.status(500).json({ status: false, error: error })
      }
    },
  }
  
  export default webhooksRoutes