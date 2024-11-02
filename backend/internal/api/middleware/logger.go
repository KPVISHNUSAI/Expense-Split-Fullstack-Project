// internal/api/middleware/logger.go

package middleware

import (
	"expense-split-app/pkg/logger"
	"github.com/gin-gonic/gin"
	"time"
)

func LoggerMiddleware(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		// Log only when path is not being skipped
		param := gin.LogFormatterParams{
			Request: c.Request,
			Keys:    c.Keys,
		}

		param.TimeStamp = time.Now()
		param.Latency = param.TimeStamp.Sub(start)

		if raw != "" {
			path = path + "?" + raw
		}

		log.Info("[GIN] %v | %3d | %13v | %15s | %-7s %#v",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			c.Writer.Status(),
			param.Latency,
			c.ClientIP(),
			c.Request.Method,
			path,
		)
	}
}
