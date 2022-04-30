// Special thanks to moviecode.tumblr.com

// Decompiled stuxnet code
// https://github.com/Laurelai/decompile-dump/blob/master/output/37FC7C5D89F1E5A96F54318DF1A2B905/37FC7C5D89F1E5A96F54318DF1A2B905.c
const fakeCode1 = `
//----- (100020A0) --------------------------------------------------------
HANDLE __cdecl sub_100020A0()
{
  HANDLE v0; // esi@1
  DWORD v1; // eax@1
  WCHAR Name; // [sp+4h] [bp-84h]@1

  v1 = GetCurrentProcessId();
  wsprintfW(&Name, L"{%08x-%08x-%08x-%08x}", v1 ^ 0x5858AA3, v1 ^ 0xAE48481, v1 ^ 0x5858721, v1 ^ 0x49481);
  v0 = CreateMutexW(0, 1, &Name);
  if ( !v0 )
    return 0;
  if ( GetLastError() == 183 && WaitForSingleObject(v0, 0x1388u) )
  {
    CloseHandle(v0);
    return 0;
  }
  return v0;
}

//----- (10002130) --------------------------------------------------------
HANDLE __cdecl sub_10002130()
{
  HANDLE v0; // esi@1
  DWORD v1; // eax@1
  WCHAR Name; // [sp+4h] [bp-84h]@1

  v1 = GetCurrentProcessId();
  wsprintfW(&Name, L"{%08x-%08x-%08x-%08x}", v1 ^ 0x9487481, v1 ^ 0x40941, v1 ^ 0x5800097, v1 ^ 0x4393481);
  v0 = CreateMutexW(0, 1, &Name);
  if ( !v0 )
    return 0;
  if ( GetLastError() == 183 && WaitForSingleObject(v0, 0x1388u) )
  {
    CloseHandle(v0);
    return 0;
  }
  return v0;
}

//----- (100021C0) --------------------------------------------------------
HRESULT __stdcall DllGetClassObject(const IID *const rclsid, const IID *const riid, LPVOID *ppv)
{
  WCHAR *v3; // eax@1
  const WCHAR *v4; // esi@1
  int v5; // eax@1
  SIZE_T v6; // ST14_4@1
  HANDLE v7; // eax@1
  int v8; // eax@2
  HRESULT result; // eax@3
  HANDLE v10; // eax@4
  char v11; // [sp-Ch] [bp-24h]@1
  char *v12; // [sp+0h] [bp-18h]@1
  int v13; // [sp+8h] [bp-10h]@1
  signed int (__usercall *v14)<eax>(int<ebp>); // [sp+Ch] [bp-Ch]@1
  _UNKNOWN *v15; // [sp+10h] [bp-8h]@1
  int v16; // [sp+14h] [bp-4h]@1

  v15 = &unk_10005618;
  v14 = sub_100028A8;
  v13 = v5;
  v12 = &v11;
  v16 = 0;
  v6 = 2 * lstrlenW((LPCWSTR)rclsid) + 2;
  v7 = GetProcessHeap();
  v3 = (WCHAR *)HeapAlloc(v7, 8u, v6);
  v4 = v3;
  if ( !v3 )
    goto LABEL_9;
  v8 = (int)lstrcpyW(v3, (LPCWSTR)rclsid);
  if ( riid )
  {
    sub_10002340(v4, v8);
    v16 = -1;
    return 1;
  }
  v10 = CreateThread(0, 0, (LPTHREAD_START_ROUTINE)StartAddress, (LPVOID)v4, 0, 0);
  if ( v10 )
  {
    CloseHandle(v10);
    v16 = -1;
    result = 1;
  }
  else
  {
LABEL_9:
    result = 0;
  }
  return result;
}
// 100021C0: inconsistent function type and number of purged bytes
`

// Linux kernel groups.c
// https://github.com/torvalds/linux/blob/master/kernel/groups.c
const fakeCode2 = `
#include <linux/cred.h>
#include <linux/export.h>
#include <linux/slab.h>
#include <linux/security.h>
#include <linux/sort.h>
#include <linux/syscalls.h>
#include <linux/user_namespace.h>
#include <linux/vmalloc.h>
#include <linux/uaccess.h>

struct group_info *groups_alloc(int gidsetsize)
{
	struct group_info *gi;
	gi = kvmalloc(struct_size(gi, gid, gidsetsize), GFP_KERNEL_ACCOUNT);
	if (!gi)
		return NULL;

	atomic_set(&gi->usage, 1);
	gi->ngroups = gidsetsize;
	return gi;
}

EXPORT_SYMBOL(groups_alloc);

void groups_free(struct group_info *group_info)
{
	kvfree(group_info);
}

EXPORT_SYMBOL(groups_free);

/* export the group_info to a user-space array */
static int groups_to_user(gid_t __user *grouplist,
			  const struct group_info *group_info)
{
	struct user_namespace *user_ns = current_user_ns();
	int i;
	unsigned int count = group_info->ngroups;

	for (i = 0; i < count; i++) {
		gid_t gid;
		gid = from_kgid_munged(user_ns, group_info->gid[i]);
		if (put_user(gid, grouplist+i))
			return -EFAULT;
	}
	return 0;
}

/* fill a group_info from a user-space array - it must be allocated already */
static int groups_from_user(struct group_info *group_info,
    gid_t __user *grouplist)
{
	struct user_namespace *user_ns = current_user_ns();
	int i;
	unsigned int count = group_info->ngroups;

	for (i = 0; i < count; i++) {
		gid_t gid;
		kgid_t kgid;
		if (get_user(gid, grouplist+i))
			return -EFAULT;

		kgid = make_kgid(user_ns, gid);
		if (!gid_valid(kgid))
			return -EINVAL;

		group_info->gid[i] = kgid;
	}
	return 0;
}

static int gid_cmp(const void *_a, const void *_b)
{
	kgid_t a = *(kgid_t *)_a;
	kgid_t b = *(kgid_t *)_b;

	return gid_gt(a, b) - gid_lt(a, b);
}

void groups_sort(struct group_info *group_info)
{
	sort(group_info->gid, group_info->ngroups, sizeof(*group_info->gid),
	     gid_cmp, NULL);
}
EXPORT_SYMBOL(groups_sort);

/* a simple bsearch */
int groups_search(const struct group_info *group_info, kgid_t grp)
{
	unsigned int left, right;

	if (!group_info)
		return 0;

	left = 0;
	right = group_info->ngroups;
	while (left < right) {
		unsigned int mid = (left+right)/2;
		if (gid_gt(grp, group_info->gid[mid]))
			left = mid + 1;
		else if (gid_lt(grp, group_info->gid[mid]))
			right = mid;
		else
			return 1;
	}
	return 0;
}
`

// port scanning script
// http://localh0t.blogspot.com/2012/02/port-tester-v01-firewall-port-testing.html
const fakeCode3 = `
import sys,socket,errno
 
# Functions goes here
 
def banner():
    return "\n####################\n# Port Tester v0.1 #\n####################"
 
def exitProgram(code):
    if code==1:
        sys.exit("\n[!] Exiting help...\n")
    if code==2:
        sys.exit("\n[!] Test finished, exiting...\n")
    if code==3:
        sys.exit("\n[!] Exiting...\n")
    if code==4:
        sys.exit("\n[-] Exiting, check arguments...\n")
 
def strToInt(convert,typeParam):
    try:
        value = int(convert)
        return value
    except:
        print "\n[-] Number given in " + typeParam + " is invalid"
        exitProgram(3)
 
def checkTimeout(timeout):
    if timeout is None or timeout <= 0:
        # Default timeout : 3 seconds
        timeout = 3
    else:
        pass
    return timeout
 
def connectHost(host,port,timeout):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((host, port))
        # Connection established, we can access that port
        return "[+] We can reach port " + str(port)
    except:
        # If some error happens (refused / filtered), we cannot access that port, print that
        return "[-] We cannot reach port " + str(port)
 
if len(sys.argv) <= 4:
    print banner()
    print "\nUsage:\n======\n\npython", sys.argv[0], "-s [START PORT] -e [END PORT] -t [TIMEOUT (Seconds) (Optional, default: 3)]"
    exitProgram(1)
 
# Set some variables
count = 0
timeout = None
start_port = None
end_port = None
 
# Read args
for arg in sys.argv:
    if arg == "-s":
        start_port = strToInt(sys.argv[count+1],"-s")
    elif arg == "-e":
        end_port = strToInt(sys.argv[count+1],"-e")
    elif arg == "-t":
        timeout = strToInt(sys.argv[count+1],"-t")
    count+=1
 
# Do some checks
if start_port is None or end_port is None:
    exitProgram(4)
timeout = checkTimeout(timeout)
 
# Test started
print banner()
print "\n[!] Port-test started..."
print "[!] Timeout: " + str(timeout) + " seconds\n"
 
hostname = '67.215.250.139' # open.zorinaq.com , 65k ports open
 
for port in range(start_port , end_port+1):
    print connectHost(hostname, port, timeout)
exitProgram(2)
`

// gRPC framework server.h
// https://grpc.github.io/grpc/cpp/grpcpp_2server_8h_source.html
const fakeCode4 = `
#ifndef GRPCPP_SERVER_H
 #define GRPCPP_SERVER_H
  
 #include <grpc/impl/codegen/port_platform.h>
  
 #include <list>
 #include <memory>
 #include <vector>
  
 #include <grpc/compression.h>
 #include <grpc/support/atm.h>
 #include <grpcpp/channel.h>
 #include <grpcpp/completion_queue.h>
 #include <grpcpp/health_check_service_interface.h>
 #include <grpcpp/impl/call.h>
 #include <grpcpp/impl/codegen/client_interceptor.h>
 #include <grpcpp/impl/codegen/completion_queue.h>
 #include <grpcpp/impl/codegen/grpc_library.h>
 #include <grpcpp/impl/codegen/server_interface.h>
 #include <grpcpp/impl/rpc_service_method.h>
 #include <grpcpp/security/server_credentials.h>
 #include <grpcpp/support/channel_arguments.h>
 #include <grpcpp/support/config.h>
 #include <grpcpp/support/status.h>
  
 struct grpc_server;
  
 namespace grpc {
 class AsyncGenericService;
 class ServerContext;
 class ServerInitializer;
  
 namespace internal {
 class ExternalConnectionAcceptorImpl;
 }  // namespace internal
  
 class Server : public ServerInterface, private GrpcLibraryCodegen {
  public:
   ~Server() ABSL_LOCKS_EXCLUDED(mu_) override;
  
   void Wait() ABSL_LOCKS_EXCLUDED(mu_) override;
  
   class GlobalCallbacks {
    public:
     virtual ~GlobalCallbacks() {}
     virtual void UpdateArguments(ChannelArguments* /*args*/) {}
     virtual void PreSynchronousRequest(ServerContext* context) = 0;
     virtual void PostSynchronousRequest(ServerContext* context) = 0;
     virtual void PreServerStart(Server* /*server*/) {}
     virtual void AddPort(Server* /*server*/, const std::string& /*addr*/,
                          ServerCredentials* /*creds*/, int /*port*/) {}
   };
   static void SetGlobalCallbacks(GlobalCallbacks* callbacks);
  
   grpc_server* c_server();
  
   HealthCheckServiceInterface* GetHealthCheckService() const {
     return health_check_service_.get();
   }
  
   std::shared_ptr<Channel> InProcessChannel(const ChannelArguments& args);
  
   class experimental_type {
    public:
     explicit experimental_type(Server* server) : server_(server) {}
  
     std::shared_ptr<Channel> InProcessChannelWithInterceptors(
         const ChannelArguments& args,
         std::vector<
             std::unique_ptr<experimental::ClientInterceptorFactoryInterface>>
             interceptor_creators);
  
    private:
     Server* server_;
   };
  
   experimental_type experimental() { return experimental_type(this); }
  
  protected:
   bool RegisterService(const std::string* addr, Service* service) override;
  
   int AddListeningPort(const std::string& addr,
                        ServerCredentials* creds) override;
  
   Server(ChannelArguments* args,
          std::shared_ptr<std::vector<std::unique_ptr<ServerCompletionQueue>>>
              sync_server_cqs,
          int min_pollers, int max_pollers, int sync_cq_timeout_msec,
          std::vector<std::shared_ptr<internal::ExternalConnectionAcceptorImpl>>
              acceptors,
          grpc_server_config_fetcher* server_config_fetcher = nullptr,
          grpc_resource_quota* server_rq = nullptr,
          std::vector<
              std::unique_ptr<experimental::ServerInterceptorFactoryInterface>>
              interceptor_creators = std::vector<std::unique_ptr<
                  experimental::ServerInterceptorFactoryInterface>>());
  
   void Start(ServerCompletionQueue** cqs, size_t num_cqs) override;
  
   grpc_server* server() override { return server_; }
  
  protected:
   void set_health_check_service(
       std::unique_ptr<HealthCheckServiceInterface> service) {
     health_check_service_ = std::move(service);
   }
  
   ContextAllocator* context_allocator() { return context_allocator_.get(); }
  
   bool health_check_service_disabled() const {
     return health_check_service_disabled_;
   }
  
  private:
   std::vector<std::unique_ptr<experimental::ServerInterceptorFactoryInterface>>*
   interceptor_creators() override {
     return &interceptor_creators_;
   }
  
   friend class AsyncGenericService;
   friend class ServerBuilder;
   friend class ServerInitializer;
  
   class SyncRequest;
   class CallbackRequestBase;
   template <class ServerContextType>
   class CallbackRequest;
   class UnimplementedAsyncRequest;
   class UnimplementedAsyncResponse;
  
   class SyncRequestThreadManager;
  
   void RegisterAsyncGenericService(AsyncGenericService* service) override;
  
   void RegisterCallbackGenericService(CallbackGenericService* service) override;
  
   void RegisterContextAllocator(
       std::unique_ptr<ContextAllocator> context_allocator) {
     context_allocator_ = std::move(context_allocator);
   }
  
   void PerformOpsOnCall(internal::CallOpSetInterface* ops,
                         internal::Call* call) override;
  
   void ShutdownInternal(gpr_timespec deadline)
       ABSL_LOCKS_EXCLUDED(mu_) override;
  
   int max_receive_message_size() const override {
     return max_receive_message_size_;
   }
  
   CompletionQueue* CallbackCQ() ABSL_LOCKS_EXCLUDED(mu_) override;
  
   ServerInitializer* initializer();
  
   // Functions to manage the server shutdown ref count. Things that increase
   // the ref count are the running state of the server (take a ref at start and
   // drop it at shutdown) and each running callback RPC.
   void Ref();
   void UnrefWithPossibleNotify() ABSL_LOCKS_EXCLUDED(mu_);
   void UnrefAndWaitLocked() ABSL_EXCLUSIVE_LOCKS_REQUIRED(mu_);
  
   std::vector<std::shared_ptr<internal::ExternalConnectionAcceptorImpl>>
       acceptors_;
  
   // A vector of interceptor factory objects.
   // This should be destroyed after health_check_service_ and this requirement
   // is satisfied by declaring interceptor_creators_ before
   // health_check_service_. (C++ mandates that member objects be destroyed in
   // the reverse order of initialization.)
   std::vector<std::unique_ptr<experimental::ServerInterceptorFactoryInterface>>
       interceptor_creators_;
  
   int max_receive_message_size_;
  
   std::shared_ptr<std::vector<std::unique_ptr<ServerCompletionQueue>>>
       sync_server_cqs_;
  
   std::vector<std::unique_ptr<SyncRequestThreadManager>> sync_req_mgrs_;
  
   // Server status
   internal::Mutex mu_;
   bool started_;
   bool shutdown_ ABSL_GUARDED_BY(mu_);
   bool shutdown_notified_
       ABSL_GUARDED_BY(mu_);  // Was notify called on the shutdown_cv_
   internal::CondVar shutdown_done_cv_;
   bool shutdown_done_ ABSL_GUARDED_BY(mu_) = false;
   std::atomic_int shutdown_refs_outstanding_{1};
  
   internal::CondVar shutdown_cv_;
  
   std::shared_ptr<GlobalCallbacks> global_callbacks_;
  
   std::vector<std::string> services_;
   bool has_async_generic_service_ = false;
   bool has_callback_generic_service_ = false;
   bool has_callback_methods_ = false;
  
   // Pointer to the wrapped grpc_server.
   grpc_server* server_;
  
   std::unique_ptr<ServerInitializer> server_initializer_;
  
   std::unique_ptr<ContextAllocator> context_allocator_;
  
   std::unique_ptr<HealthCheckServiceInterface> health_check_service_;
   bool health_check_service_disabled_;
  
   // When appropriate, use a default callback generic service to handle
   // unimplemented methods
   std::unique_ptr<CallbackGenericService> unimplemented_service_;
  
   // A special handler for resource exhausted in sync case
   std::unique_ptr<internal::MethodHandler> resource_exhausted_handler_;
  
   // Handler for callback generic service, if any
   std::unique_ptr<internal::MethodHandler> generic_handler_;
  
   // callback_cq_ references the callbackable completion queue associated
   // with this server (if any). It is set on the first call to CallbackCQ().
   // It is _not owned_ by the server; ownership belongs with its internal
   // shutdown callback tag (invoked when the CQ is fully shutdown).
   std::atomic<CompletionQueue*> callback_cq_{nullptr};
  
   // List of CQs passed in by user that must be Shutdown only after Server is
   // Shutdown.  Even though this is only used with NDEBUG, instantiate it in all
   // cases since otherwise the size will be inconsistent.
   std::vector<CompletionQueue*> cq_list_;
 };
  
 }  // namespace grpc
  
 #endif  // GRPCPP_SERVER_H
`

// "Seascape" by Alexander Alekseev aka TDM - 2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// https://glslsandbox.com/e#26701.0
const fakeCode5 = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int NUM_STEPS = 16;
const float PI	 	= 3.1415;
const float EPSILON	= 1e-3;
float EPSILON_NRM	= 0.;

// sea
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;
const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
float SEA_TIME = 0.;
mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

// math
mat3 fromEuler(vec3 ang) {
	vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
	m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
	m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
	return m;
}
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

// lighting
float diffuse(vec3 n,vec3 l,float p) {
    return pow(dot(n,l) * 0.4 + 0.6,p);
}
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

// sky
vec3 getSkyColor(vec3 e) {
    e.y = max(e.y,0.0);
    vec3 ret;
    ret.x = pow(1.0-e.y,2.0);
    ret.y = 1.0-e.y;
    ret.z = 0.6+(1.0-e.y)*0.4;
    return ret;
}

// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
    float fresnel = 1.0 - max(dot(n,-eye),0.0);
    fresnel = pow(fresnel,3.0) * 0.65;
        
    vec3 reflected = getSkyColor(reflect(eye,n));    
    vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
    
    vec3 color = mix(refracted,reflected,fresnel);
    
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
    
    color += vec3(specular(n,l,eye,60.0));
    
    return color;
}

// tracing
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p);    
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = map(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = map(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = map(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

// main
void main( void ) {
	EPSILON_NRM = 0.1 / resolution.x;
	SEA_TIME = time * SEA_SPEED;
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;    
    float time = time * 0.3 + mouse.x*0.01;
        
    // ray
    vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
    vec3 ori = vec3(0.0,3.5,time*5.0);
    vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
    dir = normalize(dir) * fromEuler(ang);
    
    // tracing
    vec3 p;
    heightMapTracing(ori,dir,p);
    vec3 dist = p - ori;
    vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
    vec3 light = normalize(vec3(0.0,1.0,0.8)); 
             
    // color
    vec3 color = mix(
        getSkyColor(dir),
        getSeaColor(p,n,light,dir,dist),
    	pow(smoothstep(0.0,-0.05,dir.y),0.3));
        
    // post
	gl_FragColor = vec4(pow(color,vec3(0.75)), 1.0);
}
`

const fakeCodes = [fakeCode1, fakeCode2, fakeCode3, fakeCode4, fakeCode5]

export default fakeCodes